const mongoose = require("mongoose");
const { env } = require("./env");
const { logger } = require("./logger");

mongoose.connection.on("error", (err) => {
  logger.error({ err }, "Unexpected error on MongoDB connection");
});

async function connectDb() {
  await mongoose.connect(env.mongoUri);
  logger.info("Connected to MongoDB");
}

module.exports = { connectDb };
