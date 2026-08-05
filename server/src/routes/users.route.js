const { Router } = require("express");
const multer = require("multer");
const { uploadMyAvatar } = require("../controllers/users.controller");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const usersRouter = Router();

usersRouter.post("/me/avatar", requireAuth, upload.single("avatar"), asyncHandler(uploadMyAvatar));

module.exports = { usersRouter };
