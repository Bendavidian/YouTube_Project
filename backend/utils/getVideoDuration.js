const ffmpeg = require("fluent-ffmpeg");

// Function to get the duration of a video file
const getVideoDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    // Use ffprobe to get metadata of the video file
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        const duration = metadata.format.duration; // Extract the duration from the metadata
        resolve(duration); // Resolve the promise with the duration
        console.log("duration:", duration); // Log the duration to the console
      }
    });
  });
};

module.exports = { getVideoDuration }; // Export the getVideoDuration function
