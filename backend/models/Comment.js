// models/Comment.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define schema for comments
const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  videoId: {
    type: Schema.Types.ObjectId,
    ref: "Video", // Reference to Video model
    required: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true, // Trim whitespace from the comment
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set default value to current date and time
  },
});
// Create Comment model from schema
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment; // Export the Comment model
