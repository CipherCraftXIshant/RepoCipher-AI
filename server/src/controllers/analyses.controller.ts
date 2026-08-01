import type { Request, Response } from "express";
import { HttpError } from "../middleware/errorHandler";
import {
  createAnalysisJob,
  getAnalysisJobWithRepository,
  listAnalysisJobsForUser,
  upsertRepository,
} from "../models/repository.model";
import { ingestionQueue } from "../queues/ingestion.queue";
import { fetchRepoMetadata, parseGithubUrl } from "../utils/github";

export async function createAnalysis(req: Request, res: Response) {
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

  const job = await createAnalysisJob(repository.id, req.userId!);
  await ingestionQueue.add("ingest", { jobId: job.id, owner: ref.owner, repo: ref.repo });

  res.status(202).json({ jobId: job.id, repository });
}

export async function getAnalysis(req: Request, res: Response) {
  const job = await getAnalysisJobWithRepository(req.params.id, req.userId!);
  if (!job) {
    throw new HttpError(404, "Analysis job not found");
  }
  res.json(job);
}

export async function listMyAnalyses(req: Request, res: Response) {
  const jobs = await listAnalysisJobsForUser(req.userId!);
  res.json({ jobs });
}
