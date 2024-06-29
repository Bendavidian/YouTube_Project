const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const Video = require("../models/Video");

const getAllVideos = async (req, res) => {
  console.log("getAllVideos: Start fetching videos"); // Add log before operation

  try {
    const videos = await Video.find().populate(
      "author",
      "username email avatar"
    );
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error); // Log the error
    res
      .status(500)
      .json({ message: "Error fetching videos", error: error.message });
  }

  console.log("getAllVideos: End fetching videos"); // Add log after operation
};

const getVideoById = async (req, res) => {
  console.log("getVideoById: Start fetching video by ID");

  try {
    const video = await Video.findById(req.params.id)
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
    console.error("Error fetching video by ID:", error);
    res
      .status(500)
      .json({ message: "Error fetching video by ID", error: error.message });
  }

  console.log("getVideoById: End fetching video by ID");
};

const updateVideoById = async (req, res) => {
  console.log("updateVideoById: Start updating video by ID");

  try {
    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;

    const video = await Video.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
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

const deleteVideoById = async (req, res) => {
  console.log("deleteVideoById: Start deleting video by ID");

  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
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

const uploadVideo = async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.user; // Get user ID from the authenticated user

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
      duration: 0, // You might need to calculate the duration separately
      uploadedBy: userId,
      author: userId,
      views: randomViews,
      likes: randomLikes,
      tags: [], // You can adjust this as needed
      comments: [],
    });

    await video.save();

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

module.exports = {
  getAllVideos,
  getVideoById,
  updateVideoById,
  deleteVideoById,
  uploadVideo,
};
