import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useVideoContext } from "../../context/VideoContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useUser } from "../../context/UserContext";
import "./Upload.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Upload component for uploading videos
const Upload = ({ onHide }) => {
  const { fetchedVideos, setFetchedVideos } = useVideoContext(); // Get and set fetched videos from context
  const { user } = useUser(); // Get the current user from context
  const [videoFile, setVideoFile] = useState(null); // State for the video file
  const [title, setTitle] = useState(""); // State for the video title
  const [description, setDescription] = useState(""); // State for the video description

  const navigate = useNavigate(); // Navigation hook

  // Handle video file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file); // Set the video file state
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (videoFile && title && description) {
      const formData = new FormData();
      formData.append("title", title); // Append title to form data
      formData.append("description", description); // Append description to form data
      formData.append("videoFile", videoFile); // Append video file to form data

      try {
        const response = await api.post(`/users/${user._id}/videos`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const newVideo = response.data.video;
        setFetchedVideos([...fetchedVideos, newVideo]); // Update fetched videos
        
        // Reset form fields
        setVideoFile(null);
        setTitle("");
        setDescription("");
        alert("Video uploaded successfully!");
        navigate("/"); // Navigate to the homepage
        onHide(); // Hide the upload form
      } catch (error) {
        console.error("Error uploading video:", error.response.data.message);
        alert("Upload failed: " + error.response.data.message); // Show error message
      }
    } else {
      alert("Please fill all fields"); // Alert if fields are empty
    }
  };

  return (
    <Container>
      <Form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
      >
        <Form.Group>
          <Form.Label style={{ fontSize: "18px", fontWeight: "bold" }}>
            Title
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Set title state on change
          />
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ fontSize: "18px", fontWeight: "bold" }}>
            Description
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Set description state on change
          />
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ fontSize: "18px", fontWeight: "bold" }}>
            Video File
          </Form.Label>
          <Form.Control
            type="file"
            accept="video/*"
            onChange={handleFileChange} // Handle file change
          />
        </Form.Group>
        <Button
          variant="primary"
          className="btn-custom mt-3 mb-3"
          type="submit"
          style={{ alignSelf: "center" }}
        >
          <span className="text">Upload</span>
        </Button>
      </Form>
    </Container>
  );
};

export default Upload; // Exporting the Upload component as default
