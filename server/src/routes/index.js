const { Router } = require("express");
const { analysesRouter } = require("./analyses.route");
const { authRouter } = require("./auth.route");
const { dashboardRouter } = require("./dashboard.route");
const { healthRouter } = require("./health.route");
const { usersRouter } = require("./users.route");

const router = Router();

router.use("/health", healthRouter);
router.use("/api/auth", authRouter);
router.use("/api/users", usersRouter);
router.use("/api/analyses", analysesRouter);
router.use("/api/dashboard", dashboardRouter);

module.exports = { router };
