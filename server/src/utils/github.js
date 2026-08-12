const { env } = require("../config/env");
const { HttpError } = require("../middleware/errorHandler");

const GITHUB_API = "https://api.github.com";

function parseGithubUrl(input) {
  const trimmed = input.trim();

  const shorthand = trimmed.match(/^([\w.-]+)\/([\w.-]+?)(\.git)?$/);
  if (shorthand) {
    return { owner: shorthand[1], repo: shorthand[2] };
  }

  try {
    const url = new URL(/^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") return null;
    const [owner, repo] = url.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/");
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}

function authHeaders() {
  const headers = { Accept: "application/vnd.github+json" };
  if (env.githubToken) headers.Authorization = `Bearer ${env.githubToken}`;
  return headers;
}

async function githubFetch(path) {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: authHeaders() });
  if (res.status === 404) {
    throw new HttpError(404, "GitHub repository not found");
  }
  if (res.status === 403 || res.status === 429) {
    throw new HttpError(502, "GitHub API rate limit exceeded");
  }
  if (!res.ok) {
    throw new HttpError(502, `GitHub API error: ${res.status}`);
  }
  return res;
}

async function fetchRepoMetadata(ref) {
  const res = await githubFetch(`/repos/${ref.owner}/${ref.repo}`);
  const data = await res.json();
  return {
    fullName: data.full_name,
    defaultBranch: data.default_branch,
    description: data.description ?? null,
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    openIssues: data.open_issues_count ?? 0,
    watchers: data.subscribers_count ?? 0,
    license: data.license?.name ?? null,
    pushedAt: data.pushed_at ?? null,
  };
}

function parseLastPageFromLinkHeader(linkHeader) {
  if (!linkHeader) return null;
  const match = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  return match ? Number(match[1]) : null;
}

async function fetchContributorsCount(ref) {
  const res = await githubFetch(`/repos/${ref.owner}/${ref.repo}/contributors?per_page=1&anon=true`);
  const lastPage = parseLastPageFromLinkHeader(res.headers.get("link"));
  if (lastPage !== null) return lastPage;
  const data = await res.json();
  return Array.isArray(data) ? data.length : null;
}

async function fetchRepoTree(ref, branch) {
  const res = await githubFetch(`/repos/${ref.owner}/${ref.repo}/git/trees/${branch}?recursive=1`);
  const data = await res.json();
  return data.tree ?? [];
}

async function fetchFileContent(ref, path, branch) {
  const res = await githubFetch(`/repos/${ref.owner}/${ref.repo}/contents/${path}?ref=${branch}`);
  const data = await res.json();
  if (data.encoding !== "base64") {
    throw new HttpError(502, `Unexpected encoding for ${path}`);
  }
  return Buffer.from(data.content, "base64").toString("utf-8");
}

async function fetchRepoLanguages(ref) {
  const res = await githubFetch(`/repos/${ref.owner}/${ref.repo}/languages`);
  return res.json();
}

module.exports = {
  parseGithubUrl,
  fetchRepoMetadata,
  fetchRepoTree,
  fetchFileContent,
  fetchRepoLanguages,
  fetchContributorsCount,
};
