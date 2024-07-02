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

router.get("/videos", get20Videos);
router.get("/videos/all", getAllVideos);
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
