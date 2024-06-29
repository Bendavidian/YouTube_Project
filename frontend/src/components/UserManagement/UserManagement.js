import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserManagement.css";
import { useUser } from "../../context/UserContext";

const UserManagement = () => {
  const { user } = useUser();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user details via API
    axios
      .put("/api/user", formData)
      .then((response) => {
        // setUser(response.data);
        setEditing(false);
      })
      .catch((error) => console.error("Error updating user data:", error));
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      {!editing ? (
        <div className="user-details">
          <img src={user.photo} alt="User" className="user-photo" />
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="photo">Photo URL:</label>
            <input
              type="text"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default UserManagement;
