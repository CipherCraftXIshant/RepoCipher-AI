const { Worker } = require("bullmq");
const { createRedisConnection } = require("../config/redis");
const { logger } = require("../config/logger");
const { updateAnalysisJob } = require("../models/repository.model");
const { analyzeRepository } = require("../services/gemini.service");
const {
  fetchFileContent,
  fetchRepoLanguages,
  fetchRepoMetadata,
  fetchRepoTree,
} = require("../utils/github");
const { INGESTION_QUEUE_NAME } = require("./ingestion.queue");

const MANIFEST_CANDIDATES = /^(package\.json|requirements\.txt|pyproject\.toml|go\.mod|Cargo\.toml)$/;

function createIngestionWorker(io) {
  const emitProgress = (jobId, status) => {
    io.to(jobId).emit("analysis:progress", { jobId, status });
  };

  return new Worker(
    INGESTION_QUEUE_NAME,
    async (job) => {
      const { jobId, owner, repo } = job.data;
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
        const manifestPath = tree.find((entry) => MANIFEST_CANDIDATES.test(entry.path))?.path;
        const manifest = manifestPath
          ? await fetchFileContent(ref, manifestPath, metadata.defaultBranch).catch(() => null)
          : null;

        await updateAnalysisJob(jobId, { status: "analyzing", fileCount: filePaths.length });
        emitProgress(jobId, "analyzing");

        const analysis = await analyzeRepository({ metadata, filePaths, readme, languages, manifest });

        await updateAnalysisJob(jobId, { status: "completed", analysis });
        emitProgress(jobId, "completed");
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
