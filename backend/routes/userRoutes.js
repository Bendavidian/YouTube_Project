const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../services/jwtService");
const {
  getVideoById,
  getVideoByUserIdAndPid,
  updateVideoById,
  deleteVideoById,
  uploadVideo,
  getUserById,
  deleteUserById,
  me,
  updateMe,
  deleteMe,
} = require("../controllers/userController");
const { upload, updateMeUpload } = require("../services/multerService");

router.get("/users/me", authenticateJWT, me);
router.put(
  "/users/me",
  authenticateJWT,
  updateMeUpload.single("avatar"),
  updateMe
);
router.delete("/users/me", authenticateJWT, deleteMe);

router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUserById);
router.get("/users/:id/videos", authenticateJWT, getVideoById);
router.get("/users/:id/videos/:pid", authenticateJWT, getVideoByUserIdAndPid);
router.put("/users/:id/videos/:pid", authenticateJWT, updateVideoById);
router.delete("/users/:id/videos/:pid", authenticateJWT, deleteVideoById);
router.post(
  "/users/:id/videos",
  authenticateJWT,
  upload.single("videoFile"),
  uploadVideo
);

module.exports = router;
