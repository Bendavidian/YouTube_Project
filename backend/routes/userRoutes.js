const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../services/jwtService");
const {
  getVideoById,
  getVideoByUserIdAndPid,
  updateVideoById,
  deleteVideoById,
  uploadVideo,
} = require("../controllers/userController");
const { upload } = require("../services/multerService");

router.get("/users/:id/videos", authenticateJWT, getVideoById);
router.get("/users/:id/videos/:pid", authenticateJWT, getVideoByUserIdAndPid);
router.put("/users/:id/videos/:pid", authenticateJWT, updateVideoById);
router.delete("/users/:id/videos/:pid", authenticateJWT, deleteVideoById);
router.post("/users/:id/videos", authenticateJWT, upload.single("videoFile"), uploadVideo);

router.post(
  "/users/:id/videos",
  authenticateJWT,
  upload.single("videoFile"),
  uploadVideo
);

module.exports = router;
