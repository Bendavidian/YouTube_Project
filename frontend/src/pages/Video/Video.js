import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row, Spinner, Button, Form } from "react-bootstrap";
import { useVideoContext } from "../../context/VideoContext";
import { useUser } from "../../context/UserContext";
import { GrLike } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiDislike } from "react-icons/bi";
import { FaShareAlt } from "react-icons/fa";
import { MdOutlineSaveAlt } from "react-icons/md";
import SocialMediaModal from "./SocialMediaModal";
import SubscriptionButton from "./SubscriptionButton";
import { CiEdit } from "react-icons/ci";
import "./video.css";
import { timeAgo } from "../../utils/timeUtils";

const VideoPlayer = () => {
  const { id } = useParams(); // Get the video ID from the URL
  const { fetchedVideos, setFetchedVideos } = useVideoContext(); // Get and set fetched videos from context
  const { user } = useUser(); // Get the current user from context
  const [video, setVideo] = useState(null); // State for the current video
  const [loading, setLoading] = useState(true); // State for loading status
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  // States for comments, likes, dislikes, and editing
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // State for modal visibility
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page when the video ID changes
  }, [id]);

  useEffect(() => {
    const fetchVideoById = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/videos/${id}`); // Fetch the video by ID
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const fetchedVideo = await response.json();
        setVideo(fetchedVideo); // Set the fetched video
        setLoading(false); // Set loading to false
        setComments(fetchedVideo?.comments); // Set comments
        setLikes(fetchedVideo?.likes); // Set likes
        setDislikes(Math.floor(Math.random() * 50) + 1); // Random dislikes for demo
        setNewTitle(fetchedVideo?.title); // Set the title
        setNewDescription(fetchedVideo?.description); // Set the description
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    fetchVideoById(); // Fetch the video data
  }, [id]);

  const fetchRecommendedVideos = async () => {
    try {
      const response = await api.post("/videos/recommendations", {
        userId: user._id,
        videoId: id, // Current video ID
      });

      setRecommendedVideos(response.data.videos); // Set recommended videos in state
    } catch (error) {
      console.error("Error fetching recommended videos:", error);
    }
  };

  useEffect(() => {
    if (!id) return; // Early return if no video ID is provided

    if (user) {
      // If the user is logged in, fetch personalized recommendations
      fetchRecommendedVideos();
    } else {
      // If the user is a guest (not logged in), show the first 10 videos from fetchedVideos
      const guestRecommendedVideos = fetchedVideos.slice(0, 10);
      setRecommendedVideos(guestRecommendedVideos); // Set the first 10 videos as the recommendations
    }
  }, [user, id, fetchedVideos]);

  const isAuthor = user?._id === video?.author._id; // Check if the current user is the author

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You are not logged in, please log in to comment");
      setComment("");
      return;
    }

    if (!comment) {
      return;
    }

    // Add a new comment
    const newComment = { comment, userId: user?._id, videoId: video._id };
    const updatedComments = [
      {
        ...newComment,
        userId: { ...user },
      },
      ...(comments || []),
    ];

    try {
      const response = await api.post("comments/new", {
        ...newComment,
      });
      const newCommentFromServer = response.data.comment;
      const updatedComments = [
        {
          ...newCommentFromServer,
          userId: { ...user },
        },
        ...(comments || []),
      ];

      setComments(updatedComments);

      console.log("comment created succesfully");
    } catch (err) {
      console.error(err);
    }
    setComment("");
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId); // Set the comment ID being edited
    setNewCommentContent(content); // Set the new comment content
  };

  const handleSaveComment = async (commentId) => {
    try {
      // Send PUT request to update the comment
      await api.put(`/comments/${commentId}`, {
        newComment: newCommentContent,
      });

      // Update the comment in the state
      const updatedComments = comments.map((comment) =>
        comment._id === commentId
          ? { ...comment, comment: newCommentContent }
          : comment
      );
      setComments(updatedComments);

      console.log("Comment updated successfully");

      // Reset editing state
      setEditingCommentId(null);
      setNewCommentContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      console.log(commentId);
      // Send DELETE request to the backend
      await api.delete(`/comments/${commentId}`);
      console.log("deleted");
      // Filter out the deleted comment from the state
      const updatedComments = comments.filter(
        (comment) => comment._id !== commentId
      );
      setComments(updatedComments);

      console.log("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1); // Increment likes
  };

  const handleDislike = () => {
    setDislikes((prevDislikes) => prevDislikes + 1); // Increment dislikes
  };

  const handleUpdateVideo = async () => {
    const updateData = {};

    if (newTitle) {
      updateData.title = newTitle; // Update title if changed
    }

    if (newDescription) {
      updateData.description = newDescription; // Update description if changed
    }

    setVideo((video) => ({
      ...video,
      title: newTitle ? newTitle : video.title,
      description: newDescription ? newDescription : video.description,
    }));

    setIsEditing(false); // Disable editing mode

    try {
      await api.put(`/videos/${id}`, updateData); // Update video data
      console.log("Video updated successfully");
    } catch (error) {
      console.log("There was an error updating the video:", error);
    }
  };

  const handleDelete = async () => {
    setFetchedVideos((videos) => videos.filter((video) => video._id !== id)); // Remove the video from the fetched list

    try {
      await api.delete(`/videos/${id}`); // Delete the video
      console.log("Video deleted successfully");
      navigate("/"); // Navigate to the homepage
    } catch (error) {
      console.log("There was an error deleting the video:", error);
      const oldVideos = fetchedVideos.push(video);
      setFetchedVideos(oldVideos); // Restore the video list in case of error
    }
  };

  const handleVideoEnd = () => {
    // Handle video end event
    const currentIndex = fetchedVideos.findIndex((v) => v._id === id);
    const nextIndex = (currentIndex + 1) % fetchedVideos.length;
    const nextVideo = fetchedVideos[nextIndex];
    navigate(`/video/${nextVideo._id}`); // Navigate to the next video
  };

  const handleShowModal = () => setShowModal(true); // Show the social media modal
  const handleCloseModal = () => setShowModal(false); // Close the social media modal

  if (loading) {
    // Render a loading spinner while fetching data
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!video) {
    // Render a message if the video is not found
    return <div className="not-found-message">Video not found!</div>;
  }

  return (
    <Container fluid className="full-width-container">
      <Row>
        <Col md={8}>
          <div className="play-video">
            <video
              key={video._id}
              width="100%"
              controls
              style={{ cursor: "pointer", borderRadius: "20px" }}
              autoPlay
              onEnded={handleVideoEnd}
            >
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="bottom">
              {isEditing ? (
                <>
                  <Form.Control
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Form.Control
                    as="textarea"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                  <Button onClick={handleUpdateVideo}>Save</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="videoTitle">{video.title}</h3>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p style={{ fontSize: "23px" }}>{video.description}</p>
                    {isAuthor && (
                      <span
                        style={{
                          marginLeft: "35px",
                          cursor: "pointer",
                        }}
                        onClick={handleEdit}
                      >
                        <CiEdit />
                      </span>
                    )}
                  </div>
                </>
              )}
              <div className="actions">
                <Link
                  to={`/videos/${video.author._id}`}
                  style={{ textDecoration: "none", color: "#000" }}
                  className="author"
                >
                  <img
                    src={video.author.avatar}
                    alt="author avatar"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  {video.author.username}
                </Link>
                <div className="icon-group">
                  <button className="icon-g" onClick={handleLike}>
                    <GrLike /> <span>{likes.toLocaleString()}</span>
                  </button>
                  <button className="icon-g" onClick={handleDislike}>
                    <BiDislike /> <span>{dislikes.toLocaleString()}</span>
                  </button>
                  <button className="icon-g" onClick={handleShowModal}>
                    <FaShareAlt />
                  </button>
                  <span className="icon-g">
                    <MdOutlineSaveAlt />
                  </span>
                  <SubscriptionButton />
                </div>
              </div>
              <div className="play-video-info">
                <p>
                  {video.views.toLocaleString()} Views &bull;{" "}
                  {timeAgo(new Date(video.createdAt))}
                  {isAuthor && (
                    <span
                      style={{
                        marginLeft: "20px",
                        cursor: "pointer",
                      }}
                      onClick={handleDelete}
                    >
                      <RiDeleteBin6Line />
                    </span>
                  )}
                </p>
              </div>
              <div className="comments">
                <h2>{user?.username} Add a comment here</h2>
                <form
                  onSubmit={handleComment}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="text"
                    value={comment}
                    placeholder="Add comment here..."
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn-c btn2">Add comment</button>
                </form>
                <div className="comments">
                  {comments?.map((comment) => (
                    <div
                      key={comment._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "15px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <img
                          src={comment.userId?.avatar}
                          alt="user photo"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        &bull; <span>{comment.userId?.username}</span>
                        {editingCommentId === comment._id ? (
                          <>
                            <Form.Control
                              type="text"
                              value={newCommentContent}
                              onChange={(e) =>
                                setNewCommentContent(e.target.value)
                              }
                            />
                            <Button
                              onClick={() => handleSaveComment(comment._id)}
                            >
                              Save
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => setEditingCommentId(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <p>{comment.comment}</p>
                        )}
                      </div>
                      {comment.userId?.username === user?.username && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span
                            style={{
                              marginLeft: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleEditComment(comment._id, comment.comment)
                            }
                          >
                            <CiEdit />
                          </span>
                          <span
                            style={{
                              marginLeft: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <RiDeleteBin6Line />
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <hr />
          </div>
        </Col>
        <Col md={1}></Col>
        <Col md={3}>
          {recommendedVideos.length > 0 ? (
            recommendedVideos.map((video) => (
              <div
                className="video-card"
                key={video._id}
                onClick={() => navigate(`/video/${video._id}`)}
              >
                <img src={video.thumbnail} width="280px" alt={video.title} />
                <div className="col">
                  <h3>{video.title}</h3>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={video.author?.avatar}
                      alt="author avatar"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    <p>{video.author?.username}</p>
                  </div>
                  <div>
                    <span>{video.views.toLocaleString()} views</span> &bull;{" "}
                    <span>{timeAgo(new Date(video.createdAt))}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No recommendations available.</p>
          )}
        </Col>
      </Row>
      <SocialMediaModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
      />
    </Container>
  );
};

export default VideoPlayer;
