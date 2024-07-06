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

// Function to update video URLs in the database
async function updateVideoUrls() {
  try {
    const videos = await Video.find(); // Fetch all videos from the database
    console.log(videos);

    // Loop through each video in videos.json
    for (const jsonVideo of videosJson) {
      const jsonTitleWords = jsonVideo.file
        .split(" ")
        .filter((word) => word.length > 0); // Split and filter words in JSON video title

      // Loop through each video in the database
      for (const dbVideo of videos) {
        const dbTitleWords = dbVideo.title
          .split(" ")
          .filter((word) => word.length > 0); // Split and filter words in DB video title

        // Find common words between JSON video title and DB video title
        const commonWords = jsonTitleWords.filter((word) =>
          dbTitleWords.includes(word)
        );
        // Update the URL if there are 3 or more common words
        if (commonWords.length >= 3) {
          dbVideo.url = jsonVideo.url;
          await dbVideo.save(); // Save the updated video to the database
          console.log(`Updated URL for video: ${dbVideo.title}`);
        }
      }
    }

    console.log("URL update process completed.");
  } catch (error) {
    console.error("Error updating video URLs:", error); // Log any errors
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
}

// Execute the function to update video URLs
updateVideoUrls();
