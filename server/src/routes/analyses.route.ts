import { Router } from "express";
import { createAnalysis, getAnalysis, listMyAnalyses } from "../controllers/analyses.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

export const analysesRouter = Router();

analysesRouter.use(requireAuth);

analysesRouter.post("/", asyncHandler(createAnalysis));
analysesRouter.get("/", asyncHandler(listMyAnalyses));
analysesRouter.get("/:id", asyncHandler(getAnalysis));
