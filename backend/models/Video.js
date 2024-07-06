// models/Video.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./User"); // Import User model

// Define schema for videos
const videoSchema = new Schema({
  title: {
    type: String,
    required: true, // Title is required
    trim: true, // Trim whitespace from the title
  },
  description: {
    type: String,
    trim: true, // Trim whitespace from the description
  },
  url: {
    type: String,
    required: true, // URL is required
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set default value to current date and time
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Set default value to current date and time
  },
  duration: {
    type: Number, // Duration in seconds
    required: true, // Duration is required
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true, // UploadedBy is required
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true, // Author is required
  },
  views: {
    type: Number,
    default: 0, // Default value for views
  },
  likes: {
    type: Number,
    default: 0, // Default value for likes
  },
  tags: {
    type: [String],
    default: [], // Default value for tags
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment", // Reference to Comment model
    },
  ],
  thumbnail: {
    type: String,
    required: true, // Thumbnail is required
  },
});

// Middleware to update `updatedAt` on document save
videoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware to update `updatedAt` on document update
videoSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = Date.now();
  next();
});

// Export the model
const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
