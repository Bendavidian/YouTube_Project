const express = require("express");
const authController = require("../controllers/authController");
const {  refreshToken } = require("../services/jwtService");

const router = express.Router();

// Authentication routes

// Route for user login
router.post("/login", authController.login);

// Route for refreshing JWT tokens
router.post("/refresh-token", refreshToken);

// Route for user registration with file upload
router.post("/register", authController.upload, authController.register);

module.exports = router; // Export the router
