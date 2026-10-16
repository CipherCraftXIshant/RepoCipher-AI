const { Server } = require("socket.io");
const { env } = require("../config/env");
const { logger } = require("../config/logger");
const { verifyAccessToken } = require("../utils/jwt");
const { getAnalysisJobWithRepository } = require("../models/repository.model");
const { Types } = require("mongoose");

function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.corsOrigin },
  });

  io.use((socket, next) => {
    const payload = verifyAccessToken(socket.handshake.auth?.token);
    if (!payload) {
      next(new Error("Unauthorized"));
      return;
    }
    socket.userId = payload.sub;
    next();
  });

  io.on("connection", (socket) => {
    logger.debug({ socketId: socket.id }, "Socket connected");

    socket.on("subscribe", async (jobId, acknowledge) => {
      if (typeof jobId !== "string" || !Types.ObjectId.isValid(jobId)) {
        if (typeof acknowledge === "function") acknowledge({ ok: false });
        return;
      }
      try {
        const job = await getAnalysisJobWithRepository(jobId, socket.userId);
        if (!job) {
          if (typeof acknowledge === "function") acknowledge({ ok: false });
          return;
        }
        socket.join(jobId);
        if (typeof acknowledge === "function") acknowledge({ ok: true });
      } catch (err) {
        logger.warn({ err, socketId: socket.id }, "Could not authorize analysis subscription");
        if (typeof acknowledge === "function") acknowledge({ ok: false });
      }
    });

    socket.on("disconnect", () => {
      logger.debug({ socketId: socket.id }, "Socket disconnected");
    });
  });

  return io;
}

module.exports = { createSocketServer };
