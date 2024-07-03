const Comment = require("../models/Comment");
const Video = require("../models/Video");
const User = require("../models/User");

const newComment = async (req, res) => {
  const { comment, userId, videoId } = req.body;

  try {
    // Find the video by ID
    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .json({ message: "No video was found with that id" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user was found with that id" });
    }

    // Create a new comment document
    const commentDoc = new Comment({
      comment,
      userId,
      videoId,
    });

    // Save the comment document
    await commentDoc.save();

    // Add the comment ID to the video's comments array
    video.comments.unshift(commentDoc._id);
    await video.save();

    // Add the comment ID to the user's comments array
    user.comments.unshift(commentDoc._id);
    await user.save();

    res.status(201).json({
      message: "Comment created successfully",
      comment: commentDoc,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating comment", error: err.message });
  }
};

module.exports = {
  newComment,
};
