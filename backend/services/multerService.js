const multer = require("multer");
const path = require("path");

// Configure storage for video uploads
const storage = multer.diskStorage({
  // Set destination for video files
  destination: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0]; // Get the file type (e.g., video)
    if (fileType === "video") {
      cb(null, "uploads/videos/"); // Save videos to "uploads/videos/" directory
    }
  },
  // Set filename for uploaded files
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp and original file extension
  },
});

// Configure storage for profile picture updates
const updateMeStorage = multer.diskStorage({
  // Set destination for profile picture files
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Save to "uploads" directory
  },
  // Set filename for uploaded files
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use current timestamp and original file name
  },
});

// Create multer instances for uploading files
const upload = multer({ storage }); // Multer instance for video uploads
const updateMeUpload = multer({ storage: updateMeStorage }); // Multer instance for profile picture updates

module.exports = { upload, updateMeUpload }; // Export multer instances
