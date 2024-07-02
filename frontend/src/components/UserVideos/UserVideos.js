import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserVideos.css";
import api from "../../api/axios";

const UserVideos = () => {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get(`/users/${id}/videos`);
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching user videos:", error);
      }
    };
    fetchVideos();
  }, [id]);

  return (
    <Container className="user-videos-container">
      <h2>Your videos:</h2>
      <Row>
        {videos.map((video) => (
          <Link to={`/video-details/${video._id}`}>
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

export default UserVideos;
