const mongoose = require("mongoose");
const ffmpeg = require("fluent-ffmpeg");
const Video = require("../models/Video");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Youtube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to get the duration of a video using ffprobe
const getVideoDuration = (url) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(url, (err, metadata) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        const duration = metadata.format.duration; // Extract the duration from the metadata
        resolve(duration); // Resolve the promise with the duration
      }
    });
  });
};

// Function to update the duration of all videos in the database
const updateVideoDurations = async () => {
  try {
    const videos = await Video.find(); // Fetch all videos from the database

    for (const video of videos) {
      try {
        const duration = await getVideoDuration(video.url); // Get the duration of the video
        video.duration = duration; // Update the video duration
        await video.save(); // Save the updated video to the database
        console.log(
          `Updated duration for video ${video.title} to ${duration} seconds`
        );
      } catch (error) {
        console.error(`Error updating video ${video.title}:`, error); // Log any errors
      }
    }

    console.log("All video durations updated");
  } catch (error) {
    console.error("Error fetching videos:", error); // Log any errors
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
};

// Run the update function
updateVideoDurations();
