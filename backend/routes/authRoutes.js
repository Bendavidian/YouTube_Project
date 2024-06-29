const express = require("express");
const authController = require("../controllers/authController");
const { authenticateJWT, refreshToken } = require("../services/jwtService");

const router = express.Router();

// Authentication routes
router.post("/login", authController.login);
router.post("/refresh-token", refreshToken);
router.post("/register", authController.upload, authController.register);

// Get user details
router.get("/me", authenticateJWT, authController.me);

module.exports = router;
