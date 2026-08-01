export type AnalysisStatus = "pending" | "fetching" | "analyzing" | "completed" | "failed";

export interface Repository {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string | null;
  description: string | null;
  createdAt: string;
}

export interface AnalysisJob {
  id: string;
  repositoryId: string;
  status: AnalysisStatus;
  error: string | null;
  fileCount: number | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisJobWithRepository extends AnalysisJob {
  repository: Repository;
}
