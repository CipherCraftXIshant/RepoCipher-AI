import { Router } from "express";
import { analysesRouter } from "./analyses.route";
import { healthRouter } from "./health.route";

export const router = Router();

router.use("/health", healthRouter);
router.use("/api/analyses", analysesRouter);
