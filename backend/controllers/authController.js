const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET; // Secret key for JWT
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET; // Secret key for refresh JWT

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set filename to current timestamp + original extension
  },
});

const upload = multer({ storage }); // Initialize multer with storage configuration

exports.upload = upload.single("avatar"); // Middleware to handle single file upload with field name 'avatar'

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" }); // Return error if user not found
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare password
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" }); // Return error if password does not match
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    }); // Generate access token

    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    }); // Generate refresh token

    res.json({ accessToken, refreshToken }); // Send tokens in response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" }); // Handle server error
  }
};

// Register controller
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const avatar = req.file
    ? `http://localhost:8080/uploads/${req.file.filename}`
    : null; // Set avatar URL if file is uploaded

  try {
    let user = await User.findOne({ email }); // Check if user already exists
    if (user) {
      return res.status(409).json({ message: "User already exists" }); // Return error if user exists
    }

    user = new User({
      username,
      email,
      password,
      avatar,
    }); // Create new user instance

    await user.save(); // Save user to database

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    }); // Generate token

    res.status(201).json({ token }); // Send token in response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" }); // Handle server error
  }
};

