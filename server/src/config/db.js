const mongoose = require("mongoose");
const { env } = require("./env");
const { logger } = require("./logger");

mongoose.connection.on("error", (err) => {
  logger.error({ err }, "Unexpected error on MongoDB connection");
});

async function connectDb() {
  await mongoose.connect(env.mongoUri);
  const host = mongoose.connection.host || "unknown host";
  const name = mongoose.connection.name || "repocipher";
  logger.info(`Connected to MongoDB Atlas database '${name}' on host '${host}'`);

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
