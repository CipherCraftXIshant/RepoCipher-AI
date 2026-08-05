const { HttpError } = require("../middleware/errorHandler");
const {
  createAnalysisJob,
  getAnalysisJobWithRepository,
  listAnalysisJobsForUser,
  upsertRepository,
} = require("../models/repository.model");
const { ingestionQueue } = require("../queues/ingestion.queue");
const { fetchRepoMetadata, parseGithubUrl } = require("../utils/github");

async function createAnalysis(req, res) {
  const { url } = req.body ?? {};
  if (typeof url !== "string" || !url.trim()) {
    throw new HttpError(400, "Body must include a 'url' field with a GitHub repository URL");
  }

  const ref = parseGithubUrl(url);
  if (!ref) {
    throw new HttpError(400, "Could not parse a GitHub owner/repo from the given URL");
  }

  const metadata = await fetchRepoMetadata(ref);
  const repository = await upsertRepository({
    owner: ref.owner,
    name: ref.repo,
    fullName: metadata.fullName,
    defaultBranch: metadata.defaultBranch,
    description: metadata.description,
  });

  const job = await createAnalysisJob(repository.id, req.userId);
  await ingestionQueue.add("ingest", { jobId: job.id, owner: ref.owner, repo: ref.repo });

  res.status(202).json({ jobId: job.id, repository });
}

async function getAnalysis(req, res) {
  const job = await getAnalysisJobWithRepository(req.params.id, req.userId);
  if (!job) {
    throw new HttpError(404, "Analysis job not found");
  }
  res.json(job);
}

async function listMyAnalyses(req, res) {
  const jobs = await listAnalysisJobsForUser(req.userId);
  res.json({ jobs });
}

module.exports = { createAnalysis, getAnalysis, listMyAnalyses };
