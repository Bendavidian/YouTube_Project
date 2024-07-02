const mongoose = require("mongoose");
const ffmpeg = require("fluent-ffmpeg");
const Video = require("../models/Video");

mongoose.connect("mongodb://localhost:27017/Youtube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const getVideoDuration = (url) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(url, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        resolve(duration);
      }
    });
  });
};

const updateVideoDurations = async () => {
  try {
    const videos = await Video.find();

    for (const video of videos) {
      try {
        const duration = await getVideoDuration(video.url);
        video.duration = duration;
        await video.save();
        console.log(
          `Updated duration for video ${video.title} to ${duration} seconds`
        );
      } catch (error) {
        console.error(`Error updating video ${video.title}:`, error);
      }
    }

    console.log("All video durations updated");
  } catch (error) {
    console.error("Error fetching videos:", error);
  } finally {
    mongoose.connection.close();
  }
};

updateVideoDurations();
