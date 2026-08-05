const { Router } = require("express");
const { createAnalysis, getAnalysis, listMyAnalyses } = require("../controllers/analyses.controller");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const analysesRouter = Router();

analysesRouter.use(requireAuth);

analysesRouter.post("/", asyncHandler(createAnalysis));
analysesRouter.get("/", asyncHandler(listMyAnalyses));
analysesRouter.get("/:id", asyncHandler(getAnalysis));

module.exports = { analysesRouter };
