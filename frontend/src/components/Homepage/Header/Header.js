import React, { useEffect, useState, useContext } from "react";
import "./Header.css";
import UploadModal from "../../UploadModal/UploadModal";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { VideoContext } from "../../../context/VideoContext";

// Header component for the application
const Header = () => {
  const { resetVideos } = useContext(VideoContext); // Get resetVideos function from context
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [user, setUser] = useState({}); // State to manage user details

  const email = sessionStorage.getItem("email"); // Get email from session storage
  const username = sessionStorage.getItem("fullName"); // Get full name from session storage

  // Use effect to check login status and set user details
  useEffect(() => {
    if (email) {
      const users = JSON.parse(sessionStorage.getItem("users")) || []; // Get users from session storage
      const userData = users.find((user) => user.email === email); // Find the logged-in user
      if (userData) {
        setUser(userData); // Set user details
        setIsLoggedIn(true); // Set login status to true
      } else {
        setIsLoggedIn(false); // Set login status to false if user not found
      }
    }
  }, [email]);

  // Handle user sign out
  const handleSignout = () => {
    sessionStorage.removeItem("email"); // Remove email from session storage
    sessionStorage.removeItem("fullName"); // Remove full name from session storage
    setIsLoggedIn(false); // Set login status to false
    resetVideos(); // Reset videos in context
  };

  return <div className="header">{/* Add header content here */}</div>; // Header content will go here
};

export default Header; // Exporting the Header component as default
