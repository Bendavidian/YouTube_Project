const express = require("express");
const commentsController = require("../controllers/commentsController");
const { authenticateJWT } = require("../services/jwtService");

const router = express.Router();

// Route to create a new comment, requires authentication
router.post("/comments/new", authenticateJWT, commentsController.newComment);

// Route to delete a comment by ID, requires authentication
router.delete(
  "/comments/:id",
  authenticateJWT,
  commentsController.deleteComment
);

// Route to edit a comment by ID, requires authentication
router.put("/comments/:id", authenticateJWT, commentsController.editComment);

module.exports = router; // Export the router

