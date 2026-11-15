const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");
const { env } = require("../config/env");

// Configure Cloudinary from URL or individual keys
if (env.cloudinaryUrl) {
  cloudinary.config({ url: env.cloudinaryUrl });
} else if (env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
}

/**
 * Uploads an avatar image buffer to Cloudinary
 * @param {string} userId
 * @param {Buffer} buffer
 * @param {string} [contentType]
 * @returns {Promise<string>} Secure URL of uploaded image
 */
async function uploadAvatar(userId, buffer, _contentType) {
  if (!env.cloudinaryCloudName && !env.cloudinaryUrl) {
    throw new Error("Cloudinary credentials are not configured");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "repocipher/avatars",
        public_id: `${userId}-${Date.now()}`,
        overwrite: true,
        resource_type: "image",
        transformation: [
          { width: 256, height: 256, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

module.exports = { uploadAvatar };
