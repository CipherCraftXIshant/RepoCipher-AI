import { Router } from "express";
import multer from "multer";
import { uploadMyAvatar } from "../controllers/users.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const usersRouter = Router();

usersRouter.post("/me/avatar", requireAuth, upload.single("avatar"), asyncHandler(uploadMyAvatar));
