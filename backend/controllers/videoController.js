const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const Video = require("../models/Video");
const { getVideoDuration } = require("../utils/getVideoDuration");
const net = require('net');

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

const get20Videos = async (req, res) => {
  console.log("get20Videos: Start fetching videos"); // Add log before operation

  try {
    // Fetch all videos and populate author details
    const allVideos = await Video.find().populate(
      "author",
      "username email avatar"
    );

    // Get 10 random videos
    let randomVideos = allVideos.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Get 10 videos with the most views
    let mostViewedVideos = allVideos
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Create a Set to track unique video IDs
    const videoIdSet = new Set();

    // Add random videos to the set
    randomVideos.forEach((video) => videoIdSet.add(video._id.toString()));

    // Filter out duplicates from the most viewed videos
    let filteredMostViewedVideos = mostViewedVideos.filter((video) => {
      if (!videoIdSet.has(video._id.toString())) {
        videoIdSet.add(video._id.toString());
        return true;
      }
      return false;
    });

    // Ensure we have 10 unique random videos
    while (filteredMostViewedVideos.length < 10) {
      const newRandomVideo =
        allVideos[Math.floor(Math.random() * allVideos.length)];
      if (!videoIdSet.has(newRandomVideo._id.toString())) {
        filteredMostViewedVideos.push(newRandomVideo);
        videoIdSet.add(newRandomVideo._id.toString());
      }
    }

    // Combine both sets of videos
    const combinedVideos = [...randomVideos, ...filteredMostViewedVideos];

    res.json(combinedVideos);
  } catch (error) {
    console.error("Error fetching videos:", error); // Log the error
    res
      .status(500)
      .json({ message: "Error fetching videos", error: error.message });
  }

  console.log("get20Videos: End fetching videos"); // Add log after operation
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

    // Create the video document
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
      tags: [], // You can adjust this as needed
      comments: [],
    });

    // Save the video document
    await video.save();

    console.log("Before calculating duration");
    // Calculate the video duration
    const duration = await getVideoDuration(req.file.path);
    video.duration = duration;

    // Save the video document with updated duration
    await video.save();

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
// Function to communicate with the TCP server
const getRecommendationsFromTcpServer = (userId, videoId) => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    
    client.connect(5555, '127.0.0.1', () => {
      console.log('Connected to TCP server');
      
      // Send userId and videoId to the server (concatenate with space or other delimiter)
      client.write(`${userId} ${videoId}`);
    });

    // Handle data received from the server
    client.on('data', (data) => {
      console.log('Received from server: ' + data);
      
      // Resolve the promise with the response (string of video IDs)
      resolve(data.toString());
      
      // Close the connection after receiving data
      client.destroy();
    });

    // Handle any error during communication
    client.on('error', (err) => {
      console.error('Error communicating with TCP server:', err);
      reject(err);
    });

    // Handle close event
    client.on('close', () => {
      console.log('Connection to TCP server closed');
    });
  });
};

// New controller function to handle requests from the frontend
const getVideoRecommendations = async (req, res) => {
  const { userId, videoId } = req.body; // Get userId and videoId from frontend request

  try {
    // Call the TCP function to get recommendations
    const recommendedVideoIds = await getRecommendationsFromTcpServer(userId, videoId);

    // Process the received video IDs from the TCP server
    const videoIdArray = recommendedVideoIds.split(" "); // Assuming space-separated video IDs

    // Fetch video details from the database using the video IDs
    const recommendedVideos = await Video.find({ _id: { $in: videoIdArray } })
      .populate("author", "username avatar");

    // Return the recommended videos to the frontend
    res.status(200).json({
      message: "Video recommendations fetched successfully",
      videos: recommendedVideos,
    });
  } catch (error) {
    console.error("Error fetching video recommendations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to send all videos and their views to the TCP server
const initializeTcpServerWithVideos = async () => {
  try {
    // Fetch all videos from the database
    const videos = await Video.find();
    
    if (!videos || videos.length === 0) {
      console.log("No videos found to send to the TCP server.");
      return;
    }

    // Format the data as "videoId views" pairs
    const videoData = videos.map(video => `${video._id.toString()} ${video.views}`).join(' ');

    // Create a TCP connection to the server
    const client = new net.Socket();

    client.connect(5555, '127.0.0.1', () => {
      console.log("Connected to TCP server for initialization");

      // Send the video data to the TCP server
      client.write(`INIT ${videoData}`);

      client.destroy(); // Close the connection after sending
      console.log("Sent video data to TCP server for initialization");
    });

    client.on('error', (err) => {
      console.error('Error sending video data to TCP server:', err);
    });

  } catch (error) {
    console.error("Error initializing TCP server with videos:", error);
  }
};

module.exports = {
  getAllVideos,
  getVideoById,
  updateVideoById,
  deleteVideoById,
  uploadVideo,
  get20Videos,
  getVideoRecommendations,
  initializeTcpServerWithVideos,
};