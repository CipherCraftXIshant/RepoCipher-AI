const { Schema, model } = require("mongoose");

const repositorySchema = new Schema({
  owner: { type: String, required: true },
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  defaultBranch: { type: String, default: null },
  description: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});
repositorySchema.index({ owner: 1, name: 1 }, { unique: true });

const RepositoryModel = model("Repository", repositorySchema);

const analysisJobSchema = new Schema(
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

const AnalysisJobModel = model("AnalysisJob", analysisJobSchema);

function toRepository(doc) {
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

function toAnalysisJob(doc) {
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

async function upsertRepository(params) {
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

async function createAnalysisJob(repositoryId, userId) {
  const doc = await AnalysisJobModel.create({ repositoryId, userId });
  return toAnalysisJob(doc);
}

async function listAnalysisJobsForUser(userId) {
  const docs = await AnalysisJobModel.find({ userId }).sort({ createdAt: -1 });
  return docs.map(toAnalysisJob);
}

async function updateAnalysisJob(id, fields) {
  const update = {};
  if (fields.status !== undefined) update.status = fields.status;
  if (fields.error !== undefined) update.error = fields.error;
  if (fields.fileCount !== undefined) update.fileCount = fields.fileCount;
  if (fields.summary !== undefined) update.summary = fields.summary;

  await AnalysisJobModel.updateOne({ _id: id }, { $set: update });
}

async function getAnalysisJobWithRepository(id, userId) {
  const doc = await AnalysisJobModel.findOne({ _id: id, userId }).populate("repositoryId");
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

module.exports = {
  upsertRepository,
  createAnalysisJob,
  listAnalysisJobsForUser,
  updateAnalysisJob,
  getAnalysisJobWithRepository,
};
