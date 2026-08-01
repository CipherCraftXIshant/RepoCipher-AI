import { Router } from "express";
import {
  googleCallback,
  googleStart,
  login,
  logout,
  me,
  refresh,
  signup,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

export const authRouter = Router();

authRouter.post("/signup", asyncHandler(signup));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/refresh", asyncHandler(refresh));
authRouter.post("/logout", asyncHandler(logout));
authRouter.get("/me", requireAuth, asyncHandler(me));

authRouter.get("/google", asyncHandler(googleStart));
authRouter.get("/google/callback", asyncHandler(googleCallback));
