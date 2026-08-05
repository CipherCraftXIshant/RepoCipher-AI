const { createServer } = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const pinoHttp = require("pino-http");
const { connectDb } = require("./config/db");
const { env } = require("./config/env");
const { logger } = require("./config/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { createIngestionWorker } = require("./queues/ingestion.worker");
const { router } = require("./routes");
const { createSocketServer } = require("./sockets");

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({ logger }));

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

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
