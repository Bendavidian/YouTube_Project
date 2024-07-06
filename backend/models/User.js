// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

// Define schema for users
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure username is unique
    trim: true, // Trim whitespace from the username
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    trim: true, // Trim whitespace from the email
  },
  password: {
    type: String,
    required: true,
    trim: true, // Trim whitespace from the password
  },
  avatar: {
    type: String,
    required: true, // URL of the user's avatar
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment", // Reference to Comment model
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video", // Reference to Video model
    },
  ],
  views: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video", // Reference to Video model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Set default value to current date and time
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // If password is not modified, move to the next middleware
  }
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt for hashing
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Move to the next middleware
  } catch (err) {
    next(err); // Pass error to the next middleware
  }
});

// Create User model from schema
const User = mongoose.model("User", userSchema);
module.exports = User; // Export the User model
