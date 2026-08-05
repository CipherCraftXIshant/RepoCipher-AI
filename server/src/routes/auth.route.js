const { Router } = require("express");
const {
  googleCallback,
  googleStart,
  login,
  logout,
  me,
  refresh,
  signup,
} = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const authRouter = Router();

authRouter.post("/signup", asyncHandler(signup));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/refresh", asyncHandler(refresh));
authRouter.post("/logout", asyncHandler(logout));
authRouter.get("/me", requireAuth, asyncHandler(me));

authRouter.get("/google", asyncHandler(googleStart));
authRouter.get("/google/callback", asyncHandler(googleCallback));

module.exports = { authRouter };
