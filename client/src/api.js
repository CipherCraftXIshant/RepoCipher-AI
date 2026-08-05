export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function parseJsonOrThrow(res) {
  if (res.status === 204) return null;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (body && typeof body.error === "string") ? body.error : `Request failed with ${res.status}`;
    throw new ApiError(res.status, message);
  }
  return body;
}

function authHeaders(accessToken) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function signupRequest(email, password) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJsonOrThrow(res);
}

export async function loginRequest(email, password) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJsonOrThrow(res);
}

export async function refreshRequest() {
  const res = await fetch("/api/auth/refresh", { method: "POST" });
  return parseJsonOrThrow(res);
}

export async function logoutRequest() {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function fetchMe(accessToken) {
  const res = await fetch("/api/auth/me", { headers: authHeaders(accessToken) });
  return parseJsonOrThrow(res);
}

export async function createAnalysis(accessToken, url) {
  const res = await fetch("/api/analyses", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(accessToken) },
    body: JSON.stringify({ url }),
  });
  return parseJsonOrThrow(res);
}

export async function getAnalysis(accessToken, id) {
  const res = await fetch(`/api/analyses/${id}`, { headers: authHeaders(accessToken) });
  return parseJsonOrThrow(res);
}

export async function listAnalyses(accessToken) {
  const res = await fetch("/api/analyses", { headers: authHeaders(accessToken) });
  return parseJsonOrThrow(res);
}

export async function uploadAvatar(accessToken, file) {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await fetch("/api/users/me/avatar", {
    method: "POST",
    headers: authHeaders(accessToken),
    body: formData,
  });
  return parseJsonOrThrow(res);
}
