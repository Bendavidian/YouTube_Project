const express = require("express");
const authController = require("../controllers/authController");
const {  refreshToken } = require("../services/jwtService");

const router = express.Router();

// Authentication routes
router.post("/login", authController.login);
router.post("/refresh-token", refreshToken);
router.post("/register", authController.upload, authController.register);

module.exports = router;
