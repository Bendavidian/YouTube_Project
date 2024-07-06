// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const videoRoutes = require("./routes/videoRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");

// Import models to ensure they are loaded
require("./models/User");
require("./models/Video");
require("./models/Comment");

const app = express();
const port = 8080;

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Enable CORS for all routes
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", videoRoutes);
app.use("/api", commentRoutes);
app.use("/api", userRoutes);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-all route to serve the index.html file for any unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
