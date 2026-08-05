const { Router } = require("express");

const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

module.exports = { healthRouter };
