const express = require("express");
const router = express.Router();
const {
  get20Videos,
  getVideoById,
  updateVideoById,
  deleteVideoById,
  uploadVideo,
  getAllVideos,
} = require("../controllers/videoController");
const { authenticateJWT } = require("../services/jwtService");
const { upload } = require("../services/multerService");

// Route to get 20 videos
router.get("/videos", get20Videos);

// Route to get all videos
router.get("/videos/all", getAllVideos);

// Route to get a video by ID
router.get("/videos/:id", getVideoById);

// Route to update a video by ID, requires authentication
router.put("/videos/:id", authenticateJWT, updateVideoById);

// Route to delete a video by ID, requires authentication
router.delete("/videos/:id", authenticateJWT, deleteVideoById);

// Route to upload a new video with file upload, requires authentication
router.post(
  "/videos/upload",
  authenticateJWT,
  upload.single("videoFile"),
  uploadVideo
);

module.exports = router; // Export the router
