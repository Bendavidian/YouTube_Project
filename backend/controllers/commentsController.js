const Comment = require("../models/Comment");
const Video = require("../models/Video");

const newComment = async (req, res) => {
  const { comment, userId, videoId } = req.body;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .json({ message: "No video was found with that id" });
    }

    const commentDoc = new Comment({
      comment,
      userId,
      videoId,
    });

    await commentDoc.save();

    video.comments.unshift(commentDoc._id);
    await video.save();

    res
      .status(201)
      .json({ message: "Comment created successfully", comment: commentDoc });
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
