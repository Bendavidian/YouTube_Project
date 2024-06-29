// models/Video.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./User");

const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    // match: [
    //   /^https?:\/\/.*\.(mp4|mov|wmv|avi|flv|mkv)$/,
    //   "Please enter a valid video URL",
    // ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number, // Duration in seconds
    required: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  tags: {
    type: [String],
    default: [],
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  thumbnail: {
    type: String,
    required: true,
    // match: [
    //   /^https?:\/\/.*\.(jpg|jpeg|png|gif|svg|webp)$/,
    //   "Please enter a valid thumbnail URL",
    // ],
  },
});

// Middleware to update `updatedAt` on document update
videoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

videoSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = Date.now();
  next();
});

// Export the model
const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
