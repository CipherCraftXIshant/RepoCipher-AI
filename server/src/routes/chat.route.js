const { Router } = require("express");
const { sendGeneralAssistantMessage } = require("../controllers/chat.controller");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const chatRouter = Router();

chatRouter.use(requireAuth);
chatRouter.post("/assistant", asyncHandler(sendGeneralAssistantMessage));

module.exports = { chatRouter };
