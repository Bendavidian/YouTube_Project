import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "../../api/axios";
import "./UserManagement.css";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useVideoContext } from "../../context/VideoContext";

// UserManagement component for managing user details
const UserManagement = () => {
  const { user, setUser } = useUser(); // Get current user and setUser function from context
  const { setFetchedVideos } = useVideoContext(); // Get setFetchedVideos function from video context
  const navigate = useNavigate(); // Hook to navigate between routes

  const [editing, setEditing] = useState(false); // State to manage edit mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: null,
  }); // State for form data
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [darkMode, setDarkMode] = useState(false); // State to manage dark mode

  // Set initial form data from user details
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: null,
      });
    }
  }, [user]);

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle form submission to update user details
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", formData.name);
    data.append("email", formData.email);
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }

    console.log(data);

    axios
      .put("/users/me", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setUser(response.data); // Update user context with new details
        setEditing(false); // Exit edit mode
      })
      .catch((error) => console.error("Error updating user data:", error));
  };

  // Handle user account deletion
  const handleDelete = () => {
    axios
      .delete("/users/me")
      .then(() => {
        setFetchedVideos((prevVideos) =>
          prevVideos.filter((video) => video.uploadedBy !== user._id)
        );
        setUser(null); // Clear user context
        navigate("/"); // Navigate to homepage
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  };

  return (
    <div className={`user-management ${darkMode ? "dark-mode" : ""}`}>
      <h2>{editing ? "Edit User Management" : "User Management"}</h2>
      {!editing ? (
        <div className="user-details">
          <img src={user?.avatar} alt="User" className="user-photo" />
          <p>
            <strong>Name:</strong> {user?.username}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <button className="btn btn-edit" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button className="btn btn-delete" onClick={() => setShowModal(true)}>
            Delete
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="avatar">Photo:</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-save">
              Save
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="custom-modal-position"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.9rem", letterSpacing: "0.05em" }}>
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            fontSize: "1.2rem",
            letterSpacing: "0.03em",
            fontWeight: "bold",
          }}
        >
          Are you sure you want to delete your account?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement; // Exporting the UserManagement component as default
