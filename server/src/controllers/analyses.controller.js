const { HttpError } = require("../middleware/errorHandler");
const {
  createAnalysisJob,
  deleteAnalysisJob,
  getAnalysisJobWithRepository,
  listAnalysisJobsForUser,
  touchLastViewed,
  updateAnalysisJob,
  upsertRepository,
} = require("../models/repository.model");
const { ingestionQueue } = require("../queues/ingestion.queue");
const { generateInterviewQuestions } = require("../services/gemini.service");
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
  await ingestionQueue.add("ingest", {
    jobId: job.id,
    owner: ref.owner,
    repo: ref.repo,
    repositoryId: repository.id,
    userId: req.userId,
  });

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

async function deleteAnalysis(req, res) {
  const deleted = await deleteAnalysisJob(req.params.id, req.userId);
  if (!deleted) {
    throw new HttpError(404, "Analysis job not found");
  }
  res.status(204).end();
}

async function touchAnalysisView(req, res) {
  const { tab } = req.body ?? {};
  await touchLastViewed(req.params.id, req.userId, typeof tab === "string" ? tab : null);
  res.status(204).end();
}

async function getInterviewQuestions(req, res) {
  const job = await getAnalysisJobWithRepository(req.params.id, req.userId);
  if (!job) {
    throw new HttpError(404, "Analysis job not found");
  }
  if (job.status !== "completed" || !job.analysis) {
    throw new HttpError(400, "This repository hasn't finished analyzing yet");
  }

  if (job.interviewQuestions?.length) {
    res.json({ questions: job.interviewQuestions });
    return;
  }

  const questions = await generateInterviewQuestions({ metadata: job.repository, analysis: job.analysis });
  await updateAnalysisJob(job.id, { interviewQuestions: questions });
  res.json({ questions });
}

module.exports = {
  createAnalysis,
  deleteAnalysis,
  getAnalysis,
  getInterviewQuestions,
  listMyAnalyses,
  touchAnalysisView,
};
