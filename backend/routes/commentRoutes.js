const express = require("express");
const commentsController = require("../controllers/commentsController");
const { authenticateJWT } = require("../services/jwtService");

const router = express.Router();

// Route to create a new comment, requires authentication
router.post("/comments/new", authenticateJWT, commentsController.newComment);

module.exports = router; // Export the router