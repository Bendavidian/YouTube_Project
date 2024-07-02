const express = require("express");
const commentsController = require("../controllers/commentsController");
const { authenticateJWT } = require("../services/jwtService");

const router = express.Router();

// Authentication routes
router.post("/comments/new", authenticateJWT, commentsController.newComment);

module.exports = router;
