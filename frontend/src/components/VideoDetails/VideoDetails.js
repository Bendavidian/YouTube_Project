import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VideoDetails.css";
import { useUser } from "../../context/UserContext";
import { useVideoContext } from "../../context/VideoContext";

// VideoDetails component for viewing and editing video details
const VideoDetails = () => {
  const { id } = useParams(); // Get video ID from URL params
  const [video, setVideo] = useState(null); // State for video details
  const [newTitle, setNewTitle] = useState(""); // State for new title input
  const [newDescription, setNewDescription] = useState(""); // State for new description input
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [updateLoading, setUpdateLoading] = useState(false); // State for update button loading indicator
  const [deleteLoading, setDeleteLoading] = useState(false); // State for delete button loading indicator
  const [error, setError] = useState(null); // State for error message
  const [success, setSuccess] = useState(null); // State for success message
  const { user } = useUser(); // Get user from context
  const { setFetchedVideos } = useVideoContext(); // Get and set fetched videos from context
  const navigate = useNavigate(); // Hook to navigate between routes

  // Fetch video details when component mounts or user changes
  useEffect(() => {
    if (!user) return;

    const fetchVideo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/users/${user?._id}/videos/${id}`);
        setVideo(response.data); // Set video details state
        setNewTitle(response.data.title); // Set new title state
        setNewDescription(response.data.description); // Set new description state
      } catch (error) {
        setError("Error fetching video details"); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };
    fetchVideo();
  }, [id, user]);

  // Handle update of video details
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUpdateLoading(true);

    const optimisticTitle = newTitle;
    const optimisticDescription = newDescription;

    // Optimistically update UI before making API call
    setVideo((prevVideo) => ({
      ...prevVideo,
      title: optimisticTitle,
      description: optimisticDescription,
    }));

    setFetchedVideos((prevVideos) =>
      prevVideos.map((v) =>
        v._id === id
          ? { ...v, title: optimisticTitle, description: optimisticDescription }
          : v
      )
    );

    setNewTitle("");
    setNewDescription("");

    try {
      await axios.put(`/users/${video.uploadedBy}/videos/${id}`, {
        title: optimisticTitle,
        description: optimisticDescription,
      });
      setSuccess("Video updated successfully"); // Set success message
    } catch (error) {
      setError("Error updating video"); // Set error message
      // Revert to original state if the update fails
      setVideo((prevVideo) => ({
        ...prevVideo,
        title: video.title,
        description: video.description,
      }));
    } finally {
      setUpdateLoading(false); // Set update loading to false
    }
  };

  // Handle deletion of video
  const handleDelete = async () => {
    setDeleteLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/users/${video.uploadedBy}/videos/${id}`);
      setSuccess("Video deleted successfully"); // Set success message
      setFetchedVideos((prevVideos) => prevVideos.filter((v) => v._id !== id)); // Remove video from state
      navigate(`/videos/${user?._id}`); // Navigate to user's video list
    } catch (error) {
      setError("Error deleting video"); // Set error message
    } finally {
      setDeleteLoading(false); // Set delete loading to false
    }
  };

  if (loading) return <Spinner animation="border" />; // Show loading spinner

  return (
    <Container className="video-details-container">
      <h2>Edit your video:</h2>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Img variant="top" src={video.thumbnail} />
            <Card.Body>
              <Card.Title>{video.title}</Card.Title>
              <Card.Text>{video.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Form onSubmit={handleUpdate}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter new description"
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Update"
              )}
            </Button>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mt-3">
              {success}
            </Alert>
          )}
          <Button
            variant="danger"
            className="mt-3"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Delete"
            )}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoDetails; // Exporting the VideoDetails component as default
