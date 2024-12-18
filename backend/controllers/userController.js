const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const Video = require("../models/Video");
const User = require("../models/User");
const Comment = require("../models/Comment");
const cloudinary = require("../scripts/cloudinary");
const { getVideoDuration } = require("../utils/getVideoDuration");
const {
  initializeTcpServerWithVideos,
} = require("../controllers/videoController");

// Get videos by user ID
const getVideoById = async (req, res) => {
  try {
    const videos = await Video.find({ uploadedBy: req.params.id }).populate(
      "author",
      "username avatar"
    );
    res.json(videos);
  } catch (error) {
    console.error("Error fetching user videos:", error);
    res
      .status(500)
      .json({ message: "Error fetching user videos", error: error.message });
  }
};

// Get a specific video by user ID and video ID
const getVideoByUserIdAndPid = async (req, res) => {
  console.log(
    "getVideoByUserIdAndPid: Start fetching video by user ID and video ID"
  );

  try {
    const { id, pid } = req.params;
    const video = await Video.findOne({ _id: pid, uploadedBy: id })
      .populate("author", "username email avatar")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "username email avatar",
        },
        select: "comment",
      });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    console.log("video:", video);
    res.json(video);
  } catch (error) {
    console.error("Error fetching video by user ID and video ID:", error);
    res
      .status(500)
      .json({ message: "Error fetching video", error: error.message });
  }

  console.log(
    "getVideoByUserIdAndPid: End fetching video by user ID and video ID"
  );
};

// Update a video by ID
const updateVideoById = async (req, res) => {
  console.log("updateVideoById: Start updating video by ID");
  const { id, pid } = req.params;

  try {
    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;

    const video = await Video.findOneAndUpdate(
      { _id: pid, uploadedBy: id },
      updateData,
      {
        new: true,
      }
    );
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    console.log("Updated video:", video);
    res.json(video);
  } catch (error) {
    console.error("Error updating video by ID:", error);
    res
      .status(500)
      .json({ message: "Error updating video by ID", error: error.message });
  }

  console.log("updateVideoById: End updating video by ID");
};

// Delete a video by ID
const deleteVideoById = async (req, res) => {
  console.log("deleteVideoById: Start deleting video by ID");
  const { id, pid } = req.params;

  try {
    const video = await Video.findOneAndDelete({ _id: pid, uploadedBy: id });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    await initializeTcpServerWithVideos();
    console.log("Deleted video:", video);
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video by ID:", error);
    res
      .status(500)
      .json({ message: "Error deleting video by ID", error: error.message });
  }

  console.log("deleteVideoById: End deleting video by ID");
};

// Ensure the thumbnails folder exists
const thumbnailsPath = path.join(__dirname, "../uploads/thumbnails");
fs.ensureDirSync(thumbnailsPath);

// Function to capture a screenshot from a video
const captureScreenshot = (videoFilePath, outputImagePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoFilePath)
      .outputOptions("-analyzeduration", "100M")
      .outputOptions("-probesize", "50M")
      .screenshots({
        timestamps: [7],
        filename: path.basename(outputImagePath),
        folder: thumbnailsPath,
        size: "640x480",
      })
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

// Upload a new video
const uploadVideo = async (req, res) => {
  const { title, description } = req.body;
  const { id: userId } = req.params;

  try {
    const videoFilePath = `http://localhost:8080/uploads/videos/${req.file.filename}`;
    const thumbnailFilename = `${Date.now()}_thumbnail.jpg`;
    const thumbnailFilePath = path.join(thumbnailsPath, thumbnailFilename);

    await captureScreenshot(req.file.path, thumbnailFilePath);

    // Generate random likes and views
    const randomLikes = Math.floor(Math.random() * (1000 - 100 + 1)) + 100; // Random likes between 100 and 1000
    const randomViews = Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000; // Random views between 1000 and 10000

    const video = new Video({
      title,
      description,
      url: videoFilePath,
      thumbnail: `http://localhost:8080/uploads/thumbnails/${thumbnailFilename}`,
      duration: 0,
      uploadedBy: userId,
      author: userId,
      views: randomViews,
      likes: randomLikes,
      tags: [],
      comments: [],
    });

    await video.save();

    const duration = await getVideoDuration(req.file.path);
    video.duration = duration;

    // Save the video document with updated duration
    await video.save();
    await initializeTcpServerWithVideos(); // Ensure the call is awaited to handle async code
    // Populate the video document with author details
    const populatedVideo = await Video.findById(video._id).populate(
      "author",
      "username avatar"
    );

    res.status(201).json({
      message: "Video uploaded successfully",
      video: populatedVideo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Error fetching user videos:", error);
    res
      .status(500)
      .json({ message: "Error fetching user videos", error: error.message });
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.json({ status: "success" });
  } catch (error) {
    console.error("Error fetching user videos:", error);
    res
      .status(500)
      .json({ message: "Error fetching user videos", error: error.message });
  }
};

// Get the current authenticated user
const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update the current authenticated user
const updateMe = async (req, res) => {
  const userId = req.user.userId;

  try {
    let updateData = req.body;

    if (req.file) {
      const filePath = req.file.path;
      const cloudinaryResult = await cloudinary.uploader.upload(filePath, {
        folder: "profile_images", // Optional: specify folder in Cloudinary
      });

      // Save the Cloudinary URL to updateData
      updateData.avatar = cloudinaryResult.secure_url;

      // Delete the file from the server's uploads folder
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    // Find the user by ID and update with new data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete the current authenticated user
const deleteMe = async (req, res) => {
  try {
    // Delete the user
    const user = await User.findByIdAndDelete(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all videos authored by the user
    const deleteVideos = await Video.deleteMany({ author: req.user.userId });

    // Delete all comments authored by the user
    const deleteComments = await Promise.all(
      user.comments.map(async (commentId) => {
        return await Comment.findByIdAndDelete(commentId);
      })
    );

    res.json({
      message: "User, videos, and comments deleted successfully",
      user,
      deletedVideos: deleteVideos,
      deletedComments: deleteComments.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error); // Log the error
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

module.exports = {
  getVideoById,
  getVideoByUserIdAndPid,
  updateVideoById,
  deleteVideoById,
  uploadVideo,
  getUserById,
  deleteUserById,
  me,
  updateMe,
  deleteMe,
  getAllUsers,
};
