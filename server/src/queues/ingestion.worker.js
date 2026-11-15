const { Worker } = require("bullmq");
const { createRedisConnection } = require("../config/redis");
const { logger } = require("../config/logger");
const { logActivity } = require("../models/activity.model");
const { updateAnalysisJob, upsertRepository } = require("../models/repository.model");
const { analyzeRepository } = require("../services/gemini.service");
const {
  fetchContributorsCount,
  fetchFileContent,
  fetchRepoLanguages,
  fetchRepoMetadata,
  fetchRepoTree,
} = require("../utils/github");
const { INGESTION_QUEUE_NAME } = require("./ingestion.queue");

const MANIFEST_CANDIDATES = /^(package\.json|requirements\.txt|pyproject\.toml|go\.mod|Cargo\.toml)$/;
const TEST_PATH_PATTERN = /(^|\/)(tests?|__tests__|spec)(\/|$)/i;
const CI_PATH_PATTERN = /^\.github\/workflows\//;
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const MAX_SOURCE_FILES = 24;
const MAX_SOURCE_FILE_CHARS = 7000;
const MAX_SOURCE_CONTEXT_CHARS = 70000;
const IGNORE_PATH = /(^|\/)(node_modules|vendor|dist|build|coverage|\.git|\.next|\.turbo|target)(\/|$)/i;
const SOURCE_EXTENSION = /\.(?:js|jsx|ts|tsx|mjs|cjs|py|go|rs|java|kt|rb|php|cs|cpp|c|h|hpp|swift|vue|svelte|html|css|scss|sql|sh|yaml|yml)$/i;

function scoreSourcePath(path) {
  if (!SOURCE_EXTENSION.test(path) || IGNORE_PATH.test(path) || path.split("/").length > 9) return -1;
  const name = path.split("/").pop();
  if (/\.(?:test|spec)\.[^.]+$/i.test(name)) return -1;
  let score = 1;
  if (/^(src|app|lib|server|client|api)\//i.test(path)) score += 4;
  if (/(^|\/)(main|index|app|server|cli|entry|router|routes|controller|service|worker)\.[^.]+$/i.test(path)) score += 6;
  if (/(^|\/)(auth|config|database|db|models?|components?|middleware|utils?)\//i.test(path)) score += 2;
  if (/(test|spec|mock|fixture|generated|\.d\.ts)/i.test(path)) score -= 5;
  return score;
}

function selectSourcePaths(filePaths) {
  return filePaths
    .map((path) => ({ path, score: scoreSourcePath(path) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .slice(0, MAX_SOURCE_FILES)
    .map((entry) => entry.path);
}

async function fetchSourceFiles(ref, paths, branch) {
  const files = [];
  let totalChars = 0;
  let cursor = 0;
  async function worker() {
    while (cursor < paths.length) {
      const path = paths[cursor++];
      if (totalChars >= MAX_SOURCE_CONTEXT_CHARS) return;
      try {
        const content = (await fetchFileContent(ref, path, branch)).slice(0, MAX_SOURCE_FILE_CHARS);
        const remaining = MAX_SOURCE_CONTEXT_CHARS - totalChars;
        const text = content.slice(0, remaining);
        if (text.trim()) {
          files.push({ path, content: text });
          totalChars += text.length;
        }
      } catch (err) {
        logger.warn({ err, path }, "Skipping unreadable source file");
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(4, paths.length) }, () => worker()));
  return files.sort((a, b) => paths.indexOf(a.path) - paths.indexOf(b.path));
}

function computeHealthScore({ hasReadme, license, filePaths, pushedAt }) {
  let score = 0;
  if (hasReadme) score += 20;
  if (license) score += 20;
  if (filePaths.some((p) => TEST_PATH_PATTERN.test(p))) score += 20;
  if (filePaths.some((p) => CI_PATH_PATTERN.test(p))) score += 20;
  if (pushedAt && Date.now() - new Date(pushedAt).getTime() < ONE_YEAR_MS) score += 20;
  return score;
}

function createIngestionWorker(io) {
  const emitProgress = (jobId, status) => {
    io.to(jobId).emit("analysis:progress", { jobId, status });
  };

  return new Worker(
    INGESTION_QUEUE_NAME,
    async (job) => {
      const { jobId, owner, repo, repositoryId, userId } = job.data;
      const ref = { owner, repo };

      try {
        await updateAnalysisJob(jobId, { status: "fetching" });
        emitProgress(jobId, "fetching");

        const metadata = await fetchRepoMetadata(ref);
        const tree = await fetchRepoTree(ref, metadata.defaultBranch);
        const filePaths = tree.filter((entry) => entry.type === "blob").map((entry) => entry.path);

        const readmePath = tree.find((entry) => /^readme\.md$/i.test(entry.path))?.path;
        const readme = readmePath
          ? await fetchFileContent(ref, readmePath, metadata.defaultBranch).catch(() => null)
          : null;

        const languages = await fetchRepoLanguages(ref).catch(() => ({}));
        const contributorsCount = await fetchContributorsCount(ref).catch(() => null);
        const manifestPath = tree.find((entry) => MANIFEST_CANDIDATES.test(entry.path))?.path;
        const manifest = manifestPath
          ? await fetchFileContent(ref, manifestPath, metadata.defaultBranch).catch(() => null)
          : null;
        const sourcePaths = selectSourcePaths(filePaths);
        const sourceFiles = await fetchSourceFiles(ref, sourcePaths, metadata.defaultBranch);

        await upsertRepository({
          owner,
          name: repo,
          fullName: metadata.fullName,
          defaultBranch: metadata.defaultBranch,
          description: metadata.description,
          stars: metadata.stars,
          forks: metadata.forks,
          openIssues: metadata.openIssues,
          watchers: metadata.watchers,
          license: metadata.license,
          pushedAt: metadata.pushedAt,
          contributorsCount,
          languages,
        });

        await updateAnalysisJob(jobId, { status: "analyzing", fileCount: filePaths.length });
        emitProgress(jobId, "analyzing");

        const analysis = await analyzeRepository({ metadata, filePaths, readme, languages, manifest, sourceFiles });
        const healthScore = computeHealthScore({
          hasReadme: Boolean(readme),
          license: metadata.license,
          filePaths,
          pushedAt: metadata.pushedAt,
        });

        await updateAnalysisJob(jobId, { status: "completed", analysis, healthScore });
        emitProgress(jobId, "completed");

        if (repositoryId && userId) {
          await logActivity({ userId, repositoryId, repositoryName: metadata.fullName, type: "analysis_completed" });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logger.error({ err, jobId }, "Ingestion job failed");
        await updateAnalysisJob(jobId, { status: "failed", error: message });
        emitProgress(jobId, "failed");
        throw err;
      }
    },
    { connection: createRedisConnection() },
  );
}

module.exports = { createIngestionWorker, selectSourcePaths };
