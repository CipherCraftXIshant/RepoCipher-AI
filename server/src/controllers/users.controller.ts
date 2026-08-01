import type { Request, Response } from "express";
import { HttpError } from "../middleware/errorHandler";
import { updateAvatarUrl } from "../models/user.model";
import { uploadAvatar } from "../services/storage.service";
import { toPublicUser } from "../types/user";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function uploadMyAvatar(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    throw new HttpError(400, "Missing 'avatar' file in request");
  }
  if (!ALLOWED_TYPES.has(file.mimetype)) {
    throw new HttpError(400, "Avatar must be a JPEG, PNG, or WebP image");
  }

  const avatarUrl = await uploadAvatar(req.userId!, file.buffer, file.mimetype);
  const user = await updateAvatarUrl(req.userId!, avatarUrl);

  res.json({ user: toPublicUser(user) });
}
