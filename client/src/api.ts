import type { AnalysisJobWithRepository, Repository } from "./types";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseJsonOrThrow(res: Response) {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (body && typeof body.error === "string") ? body.error : `Request failed with ${res.status}`;
    throw new ApiError(res.status, message);
  }
  return body;
}

export async function createAnalysis(url: string): Promise<{ jobId: string; repository: Repository }> {
  const res = await fetch("/api/analyses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return parseJsonOrThrow(res);
}

export async function getAnalysis(id: string): Promise<AnalysisJobWithRepository> {
  const res = await fetch(`/api/analyses/${id}`);
  return parseJsonOrThrow(res);
}
