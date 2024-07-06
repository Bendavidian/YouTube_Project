const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET; // Secret key for JWT
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET; // Secret key for refresh token

// Middleware to authenticate JWT
exports.authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", ""); // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Auth token is required" }); // If no token, return 401 status
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    req.user = decoded; // Attach decoded token to request
    next(); // Call next middleware
  } catch (err) {
    res.status(401).json({ message: "Invalid token" }); // If invalid token, return 401 status
  }
};

// Function to refresh JWT
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body; // Get refresh token from request body

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" }); // If no refresh token, return 400 status
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET); // Verify refresh token

    const user = await User.findById(decoded.userId); // Find user by ID
    if (!user) {
      return res.status(400).json({ message: "Invalid refresh token" }); // If user not found, return 400 status
    }

    const newAccessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    }); // Generate new access token

    res.json({ accessToken: newAccessToken }); // Return new access token
  } catch (err) { 
    console.error(err);
    res.status(401).json({ message: "Invalid or expired refresh token" }); // If invalid or expired token, return 401 status
  }
};
