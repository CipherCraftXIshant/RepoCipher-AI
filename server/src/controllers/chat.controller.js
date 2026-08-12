const { HttpError } = require("../middleware/errorHandler");
const { logActivity } = require("../models/activity.model");
const { createChatMessage, listChatMessages } = require("../models/chat.model");
const { getAnalysisJobWithRepository } = require("../models/repository.model");
const { chatAboutRepository } = require("../services/gemini.service");

const HISTORY_LIMIT = 20;

async function loadCompletedJob(jobId, userId) {
  const job = await getAnalysisJobWithRepository(jobId, userId);
  if (!job) {
    throw new HttpError(404, "Analysis job not found");
  }
  if (job.status !== "completed" || !job.analysis) {
    throw new HttpError(400, "This repository hasn't finished analyzing yet");
  }
  return job;
}

async function listChatMessagesForJob(req, res) {
  await loadCompletedJob(req.params.id, req.userId);
  const messages = await listChatMessages(req.params.id, req.userId);
  res.json({ messages });
}

async function sendChatMessage(req, res) {
  const { message } = req.body ?? {};
  if (typeof message !== "string" || !message.trim()) {
    throw new HttpError(400, "Body must include a non-empty 'message' field");
  }

  const job = await loadCompletedJob(req.params.id, req.userId);

  const priorMessages = await listChatMessages(req.params.id, req.userId);
  const history = priorMessages.slice(-HISTORY_LIMIT);

  const userMessage = await createChatMessage({
    analysisJobId: req.params.id,
    userId: req.userId,
    role: "user",
    content: message.trim(),
  });

  const reply = await chatAboutRepository({
    metadata: job.repository,
    analysis: job.analysis,
    history,
    message: message.trim(),
  });

  const modelMessage = await createChatMessage({
    analysisJobId: req.params.id,
    userId: req.userId,
    role: "model",
    content: reply,
  });

  await logActivity({
    userId: req.userId,
    repositoryId: job.repositoryId,
    repositoryName: job.repository.fullName,
    type: "chat_message",
  });

  res.status(201).json({ userMessage, modelMessage });
}

module.exports = { listChatMessagesForJob, sendChatMessage };
