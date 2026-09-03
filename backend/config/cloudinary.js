const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  const isConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('☁️ Cloudinary configured successfully.');
  } else {
    console.log('ℹ️ Cloudinary credentials not fully set. Direct media URLs can still be used.');
  }

  return cloudinary;
};

module.exports = { cloudinary, configureCloudinary };
