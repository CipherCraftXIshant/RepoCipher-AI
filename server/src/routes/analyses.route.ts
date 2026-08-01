import { Router } from "express";
import { createAnalysis, getAnalysis } from "../controllers/analyses.controller";
import { asyncHandler } from "../utils/asyncHandler";

export const analysesRouter = Router();

analysesRouter.post("/", asyncHandler(createAnalysis));
analysesRouter.get("/:id", asyncHandler(getAnalysis));
