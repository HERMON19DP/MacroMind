const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024, // 5 MB per screenshot
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Screenshots must be JPG, PNG, or WebP images."),
      );
    }

    callback(null, true);
  },
});

module.exports = upload;
