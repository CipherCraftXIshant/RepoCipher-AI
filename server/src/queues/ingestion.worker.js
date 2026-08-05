const { Worker } = require("bullmq");
const { createRedisConnection } = require("../config/redis");
const { logger } = require("../config/logger");
const { updateAnalysisJob } = require("../models/repository.model");
const { summarizeRepository } = require("../services/anthropic.service");
const { fetchFileContent, fetchRepoMetadata, fetchRepoTree } = require("../utils/github");
const { INGESTION_QUEUE_NAME } = require("./ingestion.queue");

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

        await updateAnalysisJob(jobId, { status: "analyzing", fileCount: filePaths.length });
        emitProgress(jobId, "analyzing");

        const summary = await summarizeRepository({ metadata, filePaths, readme });

        await updateAnalysisJob(jobId, { status: "completed", summary });
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
