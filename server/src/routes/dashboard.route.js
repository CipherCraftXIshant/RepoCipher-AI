const { Router } = require("express");
const { getDashboard } = require("../controllers/dashboard.controller");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/", asyncHandler(getDashboard));

module.exports = { dashboardRouter };
