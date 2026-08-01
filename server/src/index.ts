import { createServer } from "http";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { createIngestionWorker } from "./queues/ingestion.worker";
import { router } from "./routes";
import { createSocketServer } from "./sockets";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

const httpServer = createServer(app);
const io = createSocketServer(httpServer);
createIngestionWorker(io);

httpServer.listen(env.port, () => {
  logger.info(`Server listening on port ${env.port} (${env.nodeEnv})`);
});
