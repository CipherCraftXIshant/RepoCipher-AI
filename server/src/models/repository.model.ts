import { pool } from "../config/db";
import type { AnalysisJob, Repository } from "../types/repository";

function toRepository(row: any): Repository {
  return {
    id: row.id,
    owner: row.owner,
    name: row.name,
    fullName: row.full_name,
    defaultBranch: row.default_branch,
    description: row.description,
    createdAt: row.created_at,
  };
}

function toAnalysisJob(row: any): AnalysisJob {
  return {
    id: row.id,
    repositoryId: row.repository_id,
    userId: row.user_id,
    status: row.status,
    error: row.error,
    fileCount: row.file_count,
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function upsertRepository(params: {
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  description: string | null;
}): Promise<Repository> {
  const result = await pool.query(
    `INSERT INTO repositories (owner, name, full_name, default_branch, description)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (owner, name)
     DO UPDATE SET full_name = $3, default_branch = $4, description = $5
     RETURNING *`,
    [params.owner, params.name, params.fullName, params.defaultBranch, params.description],
  );
  return toRepository(result.rows[0]);
}

export async function createAnalysisJob(repositoryId: string, userId: string): Promise<AnalysisJob> {
  const result = await pool.query(
    `INSERT INTO analysis_jobs (repository_id, user_id) VALUES ($1, $2) RETURNING *`,
    [repositoryId, userId],
  );
  return toAnalysisJob(result.rows[0]);
}

export async function listAnalysisJobsForUser(userId: string): Promise<AnalysisJob[]> {
  const result = await pool.query(
    `SELECT * FROM analysis_jobs WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  );
  return result.rows.map(toAnalysisJob);
}

export async function updateAnalysisJob(
  id: string,
  fields: Partial<Pick<AnalysisJob, "status" | "error" | "fileCount" | "summary">>,
): Promise<void> {
  await pool.query(
    `UPDATE analysis_jobs
     SET status = COALESCE($2, status),
         error = COALESCE($3, error),
         file_count = COALESCE($4, file_count),
         summary = COALESCE($5, summary),
         updated_at = now()
     WHERE id = $1`,
    [id, fields.status ?? null, fields.error ?? null, fields.fileCount ?? null, fields.summary ?? null],
  );
}

export async function getAnalysisJobWithRepository(
  id: string,
  userId: string,
): Promise<(AnalysisJob & { repository: Repository }) | null> {
  const result = await pool.query(
    `SELECT aj.*, r.owner AS r_owner, r.name AS r_name, r.full_name AS r_full_name,
            r.default_branch AS r_default_branch, r.description AS r_description, r.created_at AS r_created_at
     FROM analysis_jobs aj
     JOIN repositories r ON r.id = aj.repository_id
     WHERE aj.id = $1 AND aj.user_id = $2`,
    [id, userId],
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    ...toAnalysisJob(row),
    repository: toRepository({
      id: row.repository_id,
      owner: row.r_owner,
      name: row.r_name,
      full_name: row.r_full_name,
      default_branch: row.r_default_branch,
      description: row.r_description,
      created_at: row.r_created_at,
    }),
  };
}
