const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const uploadPath = path.resolve(__dirname, '..', process.env.UPLOAD_PATH || './uploads');

// Ensure upload path directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique file name: timestamp-random-originalName
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

// File type and size limits validation
const fileFilter = (req, file, cb) => {
  const allowedTypesStr = process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp,video/mp4';
  const allowedTypes = allowedTypesStr.split(',');

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed formats: ${allowedTypesStr}`), false);
  }
};

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880; // Default 5MB

const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxFileSize
  },
  fileFilter: fileFilter
});

module.exports = upload;
