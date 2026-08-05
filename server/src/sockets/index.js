const { Server } = require("socket.io");
const { env } = require("../config/env");
const { logger } = require("../config/logger");

function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.corsOrigin },
  });

  io.on("connection", (socket) => {
    logger.debug({ socketId: socket.id }, "Socket connected");

    socket.on("subscribe", (jobId) => {
      socket.join(jobId);
    });

    socket.on("disconnect", () => {
      logger.debug({ socketId: socket.id }, "Socket disconnected");
    });
  });

  return io;
}

module.exports = { createSocketServer };
