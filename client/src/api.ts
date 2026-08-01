import type { AnalysisJob, AnalysisJobWithRepository, Repository, User } from "./types";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseJsonOrThrow(res: Response) {
  if (res.status === 204) return null;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (body && typeof body.error === "string") ? body.error : `Request failed with ${res.status}`;
    throw new ApiError(res.status, message);
  }
  return body;
}

function authHeaders(accessToken: string | null): HeadersInit {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function signupRequest(email: string, password: string): Promise<{ accessToken: string; user: User }> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJsonOrThrow(res);
}

export async function loginRequest(email: string, password: string): Promise<{ accessToken: string; user: User }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJsonOrThrow(res);
}

export async function refreshRequest(): Promise<{ accessToken: string; user: User | null }> {
  const res = await fetch("/api/auth/refresh", { method: "POST" });
  return parseJsonOrThrow(res);
}

export async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function fetchMe(accessToken: string): Promise<{ user: User }> {
  const res = await fetch("/api/auth/me", { headers: authHeaders(accessToken) });
  return parseJsonOrThrow(res);
}

export async function createAnalysis(
  accessToken: string,
  url: string,
): Promise<{ jobId: string; repository: Repository }> {
  const res = await fetch("/api/analyses", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(accessToken) },
    body: JSON.stringify({ url }),
  });
  return parseJsonOrThrow(res);
}

export async function getAnalysis(accessToken: string, id: string): Promise<AnalysisJobWithRepository> {
  const res = await fetch(`/api/analyses/${id}`, { headers: authHeaders(accessToken) });
  return parseJsonOrThrow(res);
}

export async function listAnalyses(accessToken: string): Promise<{ jobs: AnalysisJob[] }> {
  const res = await fetch("/api/analyses", { headers: authHeaders(accessToken) });
  return parseJsonOrThrow(res);
}

export async function uploadAvatar(accessToken: string, file: File): Promise<{ user: User }> {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await fetch("/api/users/me/avatar", {
    method: "POST",
    headers: authHeaders(accessToken),
    body: formData,
  });
  return parseJsonOrThrow(res);
}
