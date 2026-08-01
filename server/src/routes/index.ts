import { Router } from "express";
import { analysesRouter } from "./analyses.route";
import { authRouter } from "./auth.route";
import { healthRouter } from "./health.route";
import { usersRouter } from "./users.route";

export const router = Router();

router.use("/health", healthRouter);
router.use("/api/auth", authRouter);
router.use("/api/users", usersRouter);
router.use("/api/analyses", analysesRouter);
