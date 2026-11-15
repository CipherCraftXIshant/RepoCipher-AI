/**
 * Robust GitHub URL and shorthand parser.
 * Supports:
 * - owner/repo
 * - owner/repo.git
 * - owner/repo/
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo/tree/main/...
 * - git@github.com:owner/repo.git
 */
export function parseGithubUrl(input) {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Handle SSH format: git@github.com:owner/repo.git
  const sshMatch = trimmed.match(/^git@github\.com:([\w.-]+)\/([\w.-]+?)(?:\.git)?$/i);
  if (sshMatch) {
    return { owner: sshMatch[1], repo: sshMatch[2] };
  }

  // 2. Handle HTTP/HTTPS/Domain/Shorthand formats
  try {
    const rawUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/+/, "")}`;
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (host !== "github.com") {
      // Plain shorthand check: "owner/repo" or "owner/repo.git"
      const parts = trimmed.replace(/^\/+|\/+$/g, "").split("/");
      if (parts.length === 2 && !parts[0].includes(".")) {
        const repo = parts[1].replace(/\.git$/i, "");
        if (parts[0] && repo) return { owner: parts[0], repo };
      }
      return null;
    }

    // Extract first two path segments: /owner/repo/...
    const segments = url.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    if (segments.length >= 2) {
      const owner = segments[0];
      const repo = segments[1].replace(/\.git$/i, "");
      if (owner && repo) return { owner, repo };
    }
    return null;
  } catch {
    return null;
  }
}
