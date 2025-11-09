const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store files in the uploads directory
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Clean the original filename
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    // Generate unique filename: timestamp-cleanfilename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + cleanFileName);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  // Check mime type
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  
  // Check file extension
  const allowedExt = ['.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExt.includes(ext)) {
    return cb(new Error('Invalid file type. Only JPG, PNG and GIF files are allowed.'), false);
  }
  
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file per request
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File size too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      error: `Upload error: ${err.message}`
    });
  }
  next(err);
};

module.exports = {
  upload,
  handleMulterError
};