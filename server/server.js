const { createServer } = require("http");
const { app } = require("./src/app");
const { connectDb } = require("./src/config/db");
const { env } = require("./src/config/env");
const { logger } = require("./src/config/logger");
const { createIngestionWorker } = require("./src/queues/ingestion.worker");
const { createSocketServer } = require("./src/sockets");

async function main() {
  await connectDb();

  const httpServer = createServer(app);
  const io = createSocketServer(httpServer);
  createIngestionWorker(io);

  httpServer.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port} (${env.nodeEnv})`);
  });
}

main().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
