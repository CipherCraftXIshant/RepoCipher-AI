import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { connectDb } from "./config/db";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { createIngestionWorker } from "./queues/ingestion.worker";
import { router } from "./routes";
import { createSocketServer } from "./sockets";

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
