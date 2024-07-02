const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Video = require("../models/Video");
const Comment = require("../models/Comment");

mongoose.connect("mongodb://localhost:27017/Youtube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Connected to the database.");

  try {
    // Read videos data from the JSON file
    const videosDataPath = path.join(__dirname, "../data/videos.json");
    const videosDataJSON = JSON.parse(fs.readFileSync(videosDataPath, "utf8"));

    // Fetch all existing videos from the database
    const videosData = await Video.find();

    // Fetch all users from the database
    const users = await User.find({});
    const userIds = users.map((user) => user._id);

    if (userIds.length === 0) {
      console.error("No users found in the database.");
      return;
    }

    // Function to get a random user ID
    const getRandomUserId = () =>
      userIds[Math.floor(Math.random() * userIds.length)];

    // Loop through each video starting from index 16 and update the entries in the database
    for (let i = 16; i < videosData.length; i++) {
      const videoData = videosData[i];
      const jsonVideoData = videosDataJSON.find(
        (jsonVideo) => jsonVideo.title === videoData.title
      );

      if (!jsonVideoData) {
        console.log(
          `No matching JSON data found for video titled '${videoData.title}'.`
        );
        continue;
      }

      const uploadedBy = getRandomUserId();
      const author = uploadedBy;

      // Update video fields
      videoData.uploadedBy = uploadedBy;
      videoData.author = author;

      // Clear existing comments
      videoData.comments = [];

      // Create comments for the video from JSON data
      for (const commentData of jsonVideoData.comments) {
        const commentUserId = getRandomUserId();
        const newComment = new Comment({
          ...commentData,
          userId: commentUserId,
          videoId: videoData._id,
        });

        await newComment.save();
        videoData.comments.push(newComment._id);
      }

      // Save the updated video with the new comments
      await videoData.save();

      console.log(`Video titled '${videoData.title}' updated successfully.`);
    }

    console.log("All videos have been updated successfully.");
  } catch (error) {
    console.error("Error updating videos:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
});
