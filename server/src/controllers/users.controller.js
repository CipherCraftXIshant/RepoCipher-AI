const { HttpError } = require("../middleware/errorHandler");
const { updateAvatarUrl } = require("../models/user.model");
const { uploadAvatar } = require("../services/storage.service");
const { toPublicUser } = require("../serializers/user");

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function uploadMyAvatar(req, res) {
  const file = req.file;
  if (!file) {
    throw new HttpError(400, "Missing 'avatar' file in request");
  }
  if (!ALLOWED_TYPES.has(file.mimetype)) {
    throw new HttpError(400, "Avatar must be a JPEG, PNG, or WebP image");
  }

  const avatarUrl = await uploadAvatar(req.userId, file.buffer, file.mimetype);
  const user = await updateAvatarUrl(req.userId, avatarUrl);

  res.json({ user: toPublicUser(user) });
}

module.exports = { uploadMyAvatar };
