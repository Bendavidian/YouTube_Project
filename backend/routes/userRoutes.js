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
  getAllUsers,
} = require("../controllers/userController");
const { upload, updateMeUpload } = require("../services/multerService");

// Route to get all users
router.get("/users", getAllUsers);

// Route to get the current authenticated user
router.get("/users/me", authenticateJWT, me);

// Route to update the current authenticated user with avatar upload
router.put(
  "/users/me",
  authenticateJWT,
  updateMeUpload.single("avatar"),
  updateMe
);

// Route to delete the current authenticated user
router.delete("/users/me", authenticateJWT, deleteMe);

// Route to get a user by ID
router.get("/users/:id", getUserById);

// Route to delete a user by ID
router.delete("/users/:id", deleteUserById);

// Route to get videos by user ID
router.get("/users/:id/videos", getVideoById);

// Route to get a specific video by user ID and video ID, requires authentication
router.get("/users/:id/videos/:pid", authenticateJWT, getVideoByUserIdAndPid);

// Route to update a video by ID, requires authentication
router.put("/users/:id/videos/:pid", authenticateJWT, updateVideoById);

// Route to delete a video by ID, requires authentication
router.delete("/users/:id/videos/:pid", authenticateJWT, deleteVideoById);

// Route to upload a new video with file upload, requires authentication
router.post(
  "/users/:id/videos",
  authenticateJWT,
  upload.single("videoFile"),
  uploadVideo
);

module.exports = router; // Export the router
