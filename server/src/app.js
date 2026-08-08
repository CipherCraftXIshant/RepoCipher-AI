const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const pinoHttp = require("pino-http");
const { env } = require("./config/env");
const { logger } = require("./config/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { router } = require("./routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({ logger }));

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
