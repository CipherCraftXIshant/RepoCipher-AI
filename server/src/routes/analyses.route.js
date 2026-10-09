const { Router } = require("express");
const {
  createAnalysis,
  deleteAnalysis,
  getAnalysis,
  getInterviewQuestions,
  runInterviewTurn,
  listMyAnalyses,
  touchAnalysisView,
} = require("../controllers/analyses.controller");
const { listChatMessagesForJob, sendChatMessage } = require("../controllers/chat.controller");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const analysesRouter = Router();

analysesRouter.use(requireAuth);

analysesRouter.post("/", asyncHandler(createAnalysis));
analysesRouter.get("/", asyncHandler(listMyAnalyses));
analysesRouter.get("/:id", asyncHandler(getAnalysis));
analysesRouter.delete("/:id", asyncHandler(deleteAnalysis));
analysesRouter.patch("/:id/viewed", asyncHandler(touchAnalysisView));
analysesRouter.get("/:id/chat", asyncHandler(listChatMessagesForJob));
analysesRouter.post("/:id/chat", asyncHandler(sendChatMessage));
analysesRouter.post("/:id/interview", asyncHandler(getInterviewQuestions));
analysesRouter.post("/:id/interview/session", asyncHandler(runInterviewTurn));

module.exports = { analysesRouter };
