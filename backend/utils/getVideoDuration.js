const ffmpeg = require("fluent-ffmpeg");

const getVideoDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        resolve(duration);
        console.log("duration:", duration);
      }
    });
  });
};

module.exports = { getVideoDuration };
