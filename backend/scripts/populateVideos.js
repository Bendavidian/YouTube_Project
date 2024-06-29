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
    const videosData = JSON.parse(fs.readFileSync(videosDataPath, "utf8"));

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

    // Loop through each video and create entries in the database
    for (const videoData of videosData) {
      const uploadedBy = getRandomUserId();
      const author = uploadedBy;

      // Create video
      const newVideo = new Video({
        ...videoData,
        uploadedBy,
        author,
        comments: [], // Initialize with an empty array for comments
      });

      await newVideo.save();

      // Create comments for the video
      for (const commentData of videoData.comments) {
        const commentUserId = getRandomUserId();
        const newComment = new Comment({
          ...commentData,
          userId: commentUserId,
          videoId: newVideo._id,
        });

        await newComment.save();
        newVideo.comments.push(newComment._id);
      }

      // Save the video again with the comments
      await newVideo.save();

      console.log(`Video titled '${newVideo.title}' created successfully.`);
    }

    console.log("All videos have been populated successfully.");
  } catch (error) {
    console.error("Error populating videos:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
});
