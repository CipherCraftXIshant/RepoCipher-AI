const { Schema, model } = require("mongoose");

const chatMessageSchema = new Schema({
  analysisJobId: { type: Schema.Types.ObjectId, ref: "AnalysisJob", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["user", "model"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatMessageModel = model("ChatMessage", chatMessageSchema);

function toChatMessage(doc) {
  return {
    id: doc.id,
    analysisJobId: doc.analysisJobId.toString(),
    role: doc.role,
    content: doc.content,
    createdAt: doc.createdAt,
  };
}

async function createChatMessage({ analysisJobId, userId, role, content }) {
  const doc = await ChatMessageModel.create({ analysisJobId, userId, role, content });
  return toChatMessage(doc);
}

async function listChatMessages(analysisJobId, userId) {
  const docs = await ChatMessageModel.find({ analysisJobId, userId }).sort({ createdAt: 1 });
  return docs.map(toChatMessage);
}

module.exports = { createChatMessage, listChatMessages };
