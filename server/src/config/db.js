const mongoose = require("mongoose");
const { env } = require("./env");
const { logger } = require("./logger");

mongoose.connection.on("error", (err) => {
  logger.error({ err }, "Unexpected error on MongoDB connection");
});

async function connectDb() {
  await mongoose.connect(env.mongoUri);
  logger.info("Connected to MongoDB");

  try {
    const { UserModel } = require("../models/user.model");
    if (UserModel) {
      await UserModel.syncIndexes();
    }
  } catch (err) {
    logger.warn({ err }, "Could not auto-sync MongoDB indexes");
  }
}

module.exports = { connectDb };
