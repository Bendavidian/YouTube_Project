const mongoose = require("mongoose");
const fs = require("fs-extra");
const path = require("path");
const Video = require("../models/Video");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Youtube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load videos.json
const videosJsonPath = path.join(__dirname, "../data/videos.json");
const videosJson = fs.readJsonSync(videosJsonPath);

async function updateVideoUrls() {
  try {
    const videos = await Video.find();
    console.log(videos);

    for (const jsonVideo of videosJson) {
      const jsonTitleWords = jsonVideo.file
        .split(" ")
        .filter((word) => word.length > 0);

      for (const dbVideo of videos) {
        const dbTitleWords = dbVideo.title
          .split(" ")
          .filter((word) => word.length > 0);

        const commonWords = jsonTitleWords.filter((word) =>
          dbTitleWords.includes(word)
        );
        if (commonWords.length >= 3) {
          dbVideo.url = jsonVideo.url;
          await dbVideo.save();
          console.log(`Updated URL for video: ${dbVideo.title}`);
        }
      }
    }

    console.log("URL update process completed.");
  } catch (error) {
    console.error("Error updating video URLs:", error);
  } finally {
    mongoose.connection.close();
  }
}

updateVideoUrls();
