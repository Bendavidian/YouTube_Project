const express = require("express");
const router = express.Router();
const {
  getAllVideos,
  getVideoById,
  updateVideoById,
  deleteVideoById,
  uploadVideo,
} = require("../controllers/videoController");
const { authenticateJWT } = require("../services/jwtService");
const { upload } = require("../services/multerService");

router.get("/videos", getAllVideos);
router.get("/videos/:id", getVideoById);

// New route for updating a video
router.put("/videos/:id", authenticateJWT, updateVideoById);

// New route for deleting a video
router.delete("/videos/:id", authenticateJWT, deleteVideoById);

router.post(
  "/videos/upload",
  authenticateJWT,
  upload.single("videoFile"),
  uploadVideo
);

module.exports = router;
