// config/db.js
const mongoose = require("mongoose");

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database
    await mongoose.connect("mongodb://localhost:27017/Youtube", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected"); // Log success message
  } catch (err) {
    console.error("MongoDB connection error:", err); // Log error message
    process.exit(1); // Exit process with failure code
  }
};

module.exports = connectDB; // Export the connectDB function
