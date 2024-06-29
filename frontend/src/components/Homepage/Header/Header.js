import React, { useEffect, useState, useContext } from "react";
import "./Header.css";
import UploadModal from "../../UploadModal/UploadModal";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { VideoContext } from "../../../context/VideoContext";

const Header = () => {
  const { resetVideos } = useContext(VideoContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const email = sessionStorage.getItem("email");
  const username = sessionStorage.getItem("fullName");

  useEffect(() => {
    if (email) {
      const users = JSON.parse(sessionStorage.getItem("users")) || [];
      const userData = users.find((user) => user.email === email);
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, [email]);

  const handleSignout = () => {
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("fullName");
    setIsLoggedIn(false);
    resetVideos();
  };

  return <div className="header">{}</div>;
};

export default Header;
