import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserVideos.css";
import api from "../../api/axios";
import { useUser } from "../../context/UserContext";

// UserVideos component for displaying videos uploaded by a specific user
const UserVideos = () => {
  const { id } = useParams(); // Get user ID from URL params
  const { user, users } = useUser(); // Get current user and list of users from context
  const [videos, setVideos] = useState([]); // State for videos uploaded by the user

  const currentUser = users.find((user) => user?._id === id); // Find the current user from users list

  const isUser = id === user?._id; // Check if the displayed videos belong to the logged-in user

  // Fetch user videos when component mounts or user ID changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get(`/users/${id}/videos`);
        setVideos(response.data); // Set videos state with fetched data
      } catch (error) {
        console.error("Error fetching user videos:", error);
      }
    };
    fetchVideos();
  }, [id]);

  return (
    <Container className="user-videos-container">
      <h2>{isUser ? "Your" : currentUser?.username} videos:</h2> 
      <Row>
        {videos.map((video) => (
          <Link
            to={isUser ? `/video-details/${video._id}` : `/video/${video._id}`} // Link to video details if the user is the owner, otherwise link to video view
          >
            <Col key={video._id} md={4}> 
              <Card className="mb-4">
                <Card.Img variant="top" src={video.thumbnail} />
                <Card.Body>
                  <Card.Title>{video.title}</Card.Title>
                  <Card.Text>{video.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Link>
        ))}
      </Row>
    </Container>
  );
};

export default UserVideos; // Exporting the UserVideos component as default
