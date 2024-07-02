import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row, Spinner, Button, Form } from "react-bootstrap";
import { useVideoContext } from "../../context/VideoContext";
import { useUser } from "../../context/UserContext";
import { GrLike } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiDislike } from "react-icons/bi";
import { FaShareAlt } from "react-icons/fa";
import { MdOutlineSaveAlt } from "react-icons/md";
import SubscriptionButton from "./SubscriptionButton";
import { CiEdit } from "react-icons/ci";
import "./video.css";

const VideoPlayer = () => {
  const { id } = useParams();
  const { fetchedVideos, setFetchedVideos } = useVideoContext();
  const { user } = useUser();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchVideoById = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/videos/${id}`);
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const fetchedVideo = await response.json();
        setVideo(fetchedVideo);
        console.log(fetchedVideo);
        setLoading(false);
        setComments(fetchedVideo?.comments);
        setLikes(fetchedVideo?.likes);
        setDislikes(Math.floor(Math.random() * 50) + 1);
        setNewTitle(fetchedVideo?.title);
        setNewDescription(fetchedVideo?.description);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    fetchVideoById();
  }, [id]);

  const isAuthor = user?._id === video?.author._id;

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
    setComments(updatedComments);

    try {
      await api.post("comments/new", {
        ...newComment,
      });

      console.log("comment created succesfully");
    } catch (err) {
      console.error(err);
    }
    setComment("");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditComment = (id, content) => {
    setEditingCommentId(id);
    setNewCommentContent(content);
  };

  const handleSaveComment = (id) => {
    // Save edited comment
    const updatedComments = comments.map((comment, index) =>
      index === id ? { ...comment, comment: newCommentContent } : comment
    );

    setComments(updatedComments);

    // setVideos((prevVideos) =>
    //   prevVideos.map((v) =>
    //     v.id === video.id ? { ...v, comments: updatedComments } : v
    //   )
    // );

    setEditingCommentId(null);
    setNewCommentContent("");
  };

  const handleDeleteComment = (id) => {
    // Delete a comment
    const updatedComments = comments.filter((_, index) => index !== id);

    setComments(updatedComments);

    // setVideos((prevVideos) =>
    //   prevVideos.map((v) =>
    //     v.id === video.id ? { ...v, comments: updatedComments } : v
    //   )
    // );
  };

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1);
  };

  const handleDislike = () => {
    setDislikes((prevDislikes) => prevDislikes + 1);
  };

  const handleUpdateVideo = async () => {
    const updateData = {};

    if (newTitle) {
      updateData.title = newTitle;
    }

    if (newDescription) {
      updateData.description = newDescription;
    }

    setVideo((video) => ({
      ...video,
      title: newTitle ? newTitle : video.title,
      description: newDescription ? newDescription : video.description,
    }));

    setIsEditing(false);

    try {
      await api.put(`/videos/${id}`, updateData);
      console.log("Video updated successfully");
    } catch (error) {
      console.log("There was an error updating the video:", error);
    }
  };

  const handleDelete = async () => {
    setFetchedVideos((videos) => videos.filter((video) => video._id !== id));

    try {
      await api.delete(`/videos/${id}`);
      console.log("Video deleted successfully");
      navigate("/");
    } catch (error) {
      console.log("There was an error deleting the video:", error);
      const oldVideos = fetchedVideos.push(video);
      setFetchedVideos(oldVideos);
    }
  };

  const handleVideoEnd = () => {
    const currentIndex = fetchedVideos.findIndex((v) => v._id === id);
    const nextIndex = (currentIndex + 1) % fetchedVideos.length;
    const nextVideo = fetchedVideos[nextIndex];
    navigate(`/video/${nextVideo._id}`);
  };

  if (loading) {
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
                  <p style={{ fontSize: '23px' }}>{video.description}</p>
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
                <div className="author">
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
                </div>
                <div className="icon-group">
                  <button className="icon-g" onClick={handleLike}>
                    <GrLike /> <span>{likes}</span>
                  </button>
                  <button className="icon-g" onClick={handleDislike}>
                    <BiDislike /> <span>{dislikes}</span>
                  </button>
                  <span className="icon-g">
                    <FaShareAlt />
                  </span>
                  <span className="icon-g">
                    <MdOutlineSaveAlt />
                  </span>
                  <SubscriptionButton />
                </div>
              </div>
              <div className="play-video-info">
                <p>
                  {video.views.toLocaleString()} Views &bull;{" "}
                  {new Date(video.createdAt).toLocaleDateString()}
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
                <form onSubmit={handleComment}>
                  <input
                    type="text"
                    value={comment}
                    placeholder="Add comment here..."
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn-c btn2">Add comment</button>
                </form>
                <div className="comments">
                  {comments?.map((comment, index) => (
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
                        {editingCommentId === index ? (
                          <>
                            <Form.Control
                              type="text"
                              value={newCommentContent}
                              onChange={(e) =>
                                setNewCommentContent(e.target.value)
                              }
                            />
                            <Button onClick={() => handleSaveComment(index)}>
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
                              handleEditComment(index, comment.comment)
                            }
                          >
                            <CiEdit />
                          </span>
                          <span
                            style={{
                              marginLeft: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleDeleteComment(index)}
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
          {fetchedVideos?.map((video) => (
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
                    src={video?.author?.avatar}
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
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default VideoPlayer;
