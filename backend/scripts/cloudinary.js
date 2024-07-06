require("dotenv").config(); // Load environment variables from .env file

const cloudinary = require("cloudinary").v2; // Import Cloudinary library

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloud name from environment variables
  api_key: process.env.CLOUDINARY_API_KEY, // API key from environment variables
  api_secret: process.env.CLOUDINARY_API_SECRET, // API secret from environment variables
});

module.exports = cloudinary; // Export configured Cloudinary instance
