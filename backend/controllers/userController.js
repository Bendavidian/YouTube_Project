const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const Video = require("../models/Video");

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

const deleteVideoById = async (req, res) => {
  console.log("deleteVideoById: Start deleting video by ID");
  const { id, pid } = req.params;

  try {
    const video = await Video.findOneAndDelete({ _id: pid, uploadedBy: id });
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
  getVideoById,
  getVideoByUserIdAndPid,
  updateVideoById,
  deleteVideoById,
  uploadVideo,
};
