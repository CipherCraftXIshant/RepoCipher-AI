const { Schema, model } = require("mongoose");

const activityEventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  repositoryId: { type: Schema.Types.ObjectId, ref: "Repository", required: true },
  repositoryName: { type: String, required: true },
  type: { type: String, enum: ["analysis_completed", "chat_message"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const ActivityEventModel = model("ActivityEvent", activityEventSchema);

async function logActivity({ userId, repositoryId, repositoryName, type }) {
  await ActivityEventModel.create({ userId, repositoryId, repositoryName, type });
}

const TYPE_LABEL = {
  analysis_completed: (repoName) => `Analyzed ${repoName}`,
  chat_message: (repoName, count) => `Asked ${count} question${count === 1 ? "" : "s"} in Repo Chat for ${repoName}`,
};

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

function dayLabel(key) {
  const today = dayKey(new Date());
  const yesterday = dayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
  if (key === today) return "Today";
  if (key === yesterday) return "Yesterday";
  return new Date(key).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

async function listRecentActivity(userId, limit = 100) {
  const docs = await ActivityEventModel.find({ userId }).sort({ createdAt: -1 }).limit(limit);

  const byDay = new Map();
  for (const doc of docs) {
    const key = dayKey(doc.createdAt);
    if (!byDay.has(key)) byDay.set(key, new Map());
    const byRepoType = byDay.get(key);
    const groupKey = `${doc.repositoryId.toString()}:${doc.type}`;
    const existing = byRepoType.get(groupKey);
    if (existing) {
      existing.count += 1;
    } else {
      byRepoType.set(groupKey, { repositoryName: doc.repositoryName, type: doc.type, count: 1 });
    }
  }

  return Array.from(byDay.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, byRepoType]) => ({
      day: dayLabel(key),
      events: Array.from(byRepoType.values()).map((entry) => ({
        type: entry.type,
        label: TYPE_LABEL[entry.type](entry.repositoryName, entry.count),
      })),
    }));
}

async function getChatMessageCount(userId) {
  return ActivityEventModel.countDocuments({ userId, type: "chat_message" });
}

module.exports = { logActivity, listRecentActivity, getChatMessageCount };
