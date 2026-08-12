const { Schema, model, Types } = require("mongoose");

const repositorySchema = new Schema({
  owner: { type: String, required: true },
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  defaultBranch: { type: String, default: null },
  description: { type: String, default: null },
  stars: { type: Number, default: null },
  forks: { type: Number, default: null },
  openIssues: { type: Number, default: null },
  watchers: { type: Number, default: null },
  license: { type: String, default: null },
  pushedAt: { type: Date, default: null },
  contributorsCount: { type: Number, default: null },
  languages: { type: Schema.Types.Mixed, default: null },
  createdAt: { type: Date, default: Date.now },
});
repositorySchema.index({ owner: 1, name: 1 }, { unique: true });

const RepositoryModel = model("Repository", repositorySchema);

const analysisSchema = new Schema(
  {
    overview: { type: String, default: null },
    stack: { type: [{ name: String, role: String }], default: [] },
    architecture: { type: [{ label: String, description: String }], default: [] },
    entryPoints: { type: [{ path: String, note: String }], default: [] },
    dependencies: { type: [{ name: String, version: String, role: String }], default: [] },
    directories: {
      type: [{ path: String, note: String, files: { type: [{ path: String, note: String }], default: [] } }],
      default: [],
    },
    setup: { type: String, default: null },
    risks: { type: [{ title: String, severity: String, description: String }], default: [] },
  },
  { _id: false },
);

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
    analysis: { type: analysisSchema, default: null },
    healthScore: { type: Number, default: null },
    lastViewedAt: { type: Date, default: null },
    lastViewedTab: { type: String, default: null },
    interviewQuestions: {
      type: [{ category: String, question: String, answer: String }],
      default: null,
    },
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
    stars: doc.stars,
    forks: doc.forks,
    openIssues: doc.openIssues,
    watchers: doc.watchers,
    license: doc.license,
    pushedAt: doc.pushedAt,
    contributorsCount: doc.contributorsCount,
    languages: doc.languages,
    createdAt: doc.createdAt,
  };
}

function toAnalysisJob(doc) {
  const repositoryPopulated = doc.repositoryId && typeof doc.repositoryId === "object" && doc.repositoryId.owner;
  return {
    id: doc.id,
    repositoryId: repositoryPopulated ? doc.repositoryId.id : doc.repositoryId.toString(),
    userId: doc.userId.toString(),
    status: doc.status,
    error: doc.error,
    fileCount: doc.fileCount,
    analysis: doc.analysis,
    healthScore: doc.healthScore,
    lastViewedAt: doc.lastViewedAt,
    lastViewedTab: doc.lastViewedTab,
    interviewQuestions: doc.interviewQuestions,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    ...(repositoryPopulated ? { repository: toRepository(doc.repositoryId) } : {}),
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
        stars: params.stars,
        forks: params.forks,
        openIssues: params.openIssues,
        watchers: params.watchers,
        license: params.license,
        pushedAt: params.pushedAt,
        contributorsCount: params.contributorsCount,
        languages: params.languages,
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
  const docs = await AnalysisJobModel.find({ userId }).sort({ updatedAt: -1 }).populate("repositoryId");
  return docs.map(toAnalysisJob);
}

async function updateAnalysisJob(id, fields) {
  const update = {};
  if (fields.status !== undefined) update.status = fields.status;
  if (fields.error !== undefined) update.error = fields.error;
  if (fields.fileCount !== undefined) update.fileCount = fields.fileCount;
  if (fields.analysis !== undefined) update.analysis = fields.analysis;
  if (fields.healthScore !== undefined) update.healthScore = fields.healthScore;
  if (fields.interviewQuestions !== undefined) update.interviewQuestions = fields.interviewQuestions;

  await AnalysisJobModel.updateOne({ _id: id }, { $set: update });
}

async function getAnalysisJobWithRepository(id, userId) {
  const doc = await AnalysisJobModel.findOne({ _id: id, userId }).populate("repositoryId");
  if (!doc) return null;
  return toAnalysisJob(doc);
}

async function deleteAnalysisJob(id, userId) {
  const result = await AnalysisJobModel.deleteOne({ _id: id, userId });
  return result.deletedCount > 0;
}

async function touchLastViewed(id, userId, tab) {
  await AnalysisJobModel.updateOne(
    { _id: id, userId },
    { $set: { lastViewedAt: new Date(), ...(tab ? { lastViewedTab: tab } : {}) } },
  );
}

async function findMostRecentlyViewedJob(userId) {
  const doc = await AnalysisJobModel.findOne({ userId, status: "completed", lastViewedAt: { $ne: null } })
    .sort({ lastViewedAt: -1 })
    .populate("repositoryId");
  return doc ? toAnalysisJob(doc) : null;
}

async function getUserAnalysisStats(userId) {
  const uid = Types.ObjectId.createFromHexString(userId);

  const [repoCount, totalAnalyses, healthAgg] = await Promise.all([
    AnalysisJobModel.distinct("repositoryId", { userId: uid }).then((ids) => ids.length),
    AnalysisJobModel.countDocuments({ userId: uid }),
    AnalysisJobModel.aggregate([
      { $match: { userId: uid, status: "completed", healthScore: { $ne: null } } },
      { $group: { _id: null, avg: { $avg: "$healthScore" } } },
    ]),
  ]);

  return {
    repoCount,
    totalAnalyses,
    avgHealth: healthAgg[0] ? Math.round(healthAgg[0].avg) : null,
  };
}

module.exports = {
  upsertRepository,
  createAnalysisJob,
  listAnalysisJobsForUser,
  updateAnalysisJob,
  getAnalysisJobWithRepository,
  deleteAnalysisJob,
  touchLastViewed,
  findMostRecentlyViewedJob,
  getUserAnalysisStats,
};
