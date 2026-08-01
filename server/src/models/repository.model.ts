import { Schema, model, Types, type HydratedDocument } from "mongoose";
import type { AnalysisJob, AnalysisStatus, Repository } from "../types/repository";

interface RepositoryDoc {
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string | null;
  description: string | null;
  createdAt: Date;
}

const repositorySchema = new Schema<RepositoryDoc>({
  owner: { type: String, required: true },
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  defaultBranch: { type: String, default: null },
  description: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});
repositorySchema.index({ owner: 1, name: 1 }, { unique: true });

const RepositoryModel = model<RepositoryDoc>("Repository", repositorySchema);

interface AnalysisJobDoc {
  repositoryId: Types.ObjectId;
  userId: Types.ObjectId;
  status: AnalysisStatus;
  error: string | null;
  fileCount: number | null;
  summary: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const analysisJobSchema = new Schema<AnalysisJobDoc>(
  {
    repositoryId: { type: Schema.Types.ObjectId, ref: "Repository", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "fetching", "analyzing", "completed", "failed"],
      default: "pending",
    },
    error: { type: String, default: null },
    fileCount: { type: Number, default: null },
    summary: { type: String, default: null },
  },
  { timestamps: true },
);

const AnalysisJobModel = model<AnalysisJobDoc>("AnalysisJob", analysisJobSchema);

function toRepository(doc: HydratedDocument<RepositoryDoc>): Repository {
  return {
    id: doc.id,
    owner: doc.owner,
    name: doc.name,
    fullName: doc.fullName,
    defaultBranch: doc.defaultBranch,
    description: doc.description,
    createdAt: doc.createdAt,
  };
}

function toAnalysisJob(doc: HydratedDocument<AnalysisJobDoc>): AnalysisJob {
  return {
    id: doc.id,
    repositoryId: doc.repositoryId.toString(),
    userId: doc.userId.toString(),
    status: doc.status,
    error: doc.error,
    fileCount: doc.fileCount,
    summary: doc.summary,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function upsertRepository(params: {
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  description: string | null;
}): Promise<Repository> {
  const doc = await RepositoryModel.findOneAndUpdate(
    { owner: params.owner, name: params.name },
    {
      $set: {
        fullName: params.fullName,
        defaultBranch: params.defaultBranch,
        description: params.description,
      },
    },
    { new: true, upsert: true },
  );
  return toRepository(doc);
}

export async function createAnalysisJob(repositoryId: string, userId: string): Promise<AnalysisJob> {
  const doc = await AnalysisJobModel.create({ repositoryId, userId });
  return toAnalysisJob(doc);
}

export async function listAnalysisJobsForUser(userId: string): Promise<AnalysisJob[]> {
  const docs = await AnalysisJobModel.find({ userId }).sort({ createdAt: -1 });
  return docs.map(toAnalysisJob);
}

export async function updateAnalysisJob(
  id: string,
  fields: Partial<Pick<AnalysisJob, "status" | "error" | "fileCount" | "summary">>,
): Promise<void> {
  const update: Record<string, unknown> = {};
  if (fields.status !== undefined) update.status = fields.status;
  if (fields.error !== undefined) update.error = fields.error;
  if (fields.fileCount !== undefined) update.fileCount = fields.fileCount;
  if (fields.summary !== undefined) update.summary = fields.summary;

  await AnalysisJobModel.updateOne({ _id: id }, { $set: update });
}

export async function getAnalysisJobWithRepository(
  id: string,
  userId: string,
): Promise<(AnalysisJob & { repository: Repository }) | null> {
  const doc = await AnalysisJobModel.findOne({ _id: id, userId }).populate<{
    repositoryId: HydratedDocument<RepositoryDoc>;
  }>("repositoryId");
  if (!doc) return null;

  const repository = toRepository(doc.repositoryId);
  return {
    id: doc.id,
    repositoryId: repository.id,
    userId: doc.userId.toString(),
    status: doc.status,
    error: doc.error,
    fileCount: doc.fileCount,
    summary: doc.summary,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    repository,
  };
}
