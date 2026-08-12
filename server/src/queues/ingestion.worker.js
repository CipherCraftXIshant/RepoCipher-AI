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

        const analysis = await analyzeRepository({ metadata, filePaths, readme, languages, manifest });
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

module.exports = { createIngestionWorker };
