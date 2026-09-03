const multer = require('multer');
const streamifier = require('streamifier');
const { cloudinary } = require('../config/cloudinary');

// Multer in-memory storage configuration
const storage = multer.memoryStorage();

// File filter for allowed media formats (images & videos)
const fileFilter = (req, file, cb) => {
  const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/mpeg'];

  if (
    allowedImageMimes.includes(file.mimetype) ||
    allowedVideoMimes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Allowed formats: JPG, PNG, WEBP, MP4, WEBM, MOV.`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 60 * 1024 * 1024, // 60 MB maximum for food reels
  },
  fileFilter,
});

/**
 * Upload buffer to Cloudinary using streams
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Destination folder on Cloudinary
 * @param {string} resourceType - 'image' | 'video' | 'auto'
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer, folder = 'vs_food', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return reject(new Error('Cloudinary credentials are not configured in backend/.env'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = {
  upload,
  uploadToCloudinary,
};
