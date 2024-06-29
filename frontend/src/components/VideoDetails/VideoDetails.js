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

const VideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchVideo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/users/${user?._id}/videos/${id}`);
        setVideo(response.data);
        setNewTitle(response.data.title);
        setNewDescription(response.data.description);
      } catch (error) {
        setError("Error fetching video details");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUpdateLoading(true);

    const optimisticTitle = newTitle;
    const optimisticDescription = newDescription;

    setVideo((prevVideo) => ({
      ...prevVideo,
      title: optimisticTitle,
      description: optimisticDescription,
    }));

    setNewTitle("");
    setNewDescription("");

    try {
      await axios.put(`/users/${video.uploadedBy}/videos/${id}`, {
        title: optimisticTitle,
        description: optimisticDescription,
      });
      setSuccess("Video updated successfully");
    } catch (error) {
      setError("Error updating video");
      // Revert to original state if the update fails
      setVideo((prevVideo) => ({
        ...prevVideo,
        title: video.title,
        description: video.description,
      }));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/users/${video.uploadedBy}/videos/${id}`);
      setSuccess("Video deleted successfully");
      navigate(`/videos/${user?._id}`);
    } catch (error) {
      setError("Error deleting video");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

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

export default VideoDetails;
