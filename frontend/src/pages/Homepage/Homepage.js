import React, { useEffect } from "react";
import "./Homepage.css";
import VideoListResults from "../../components/Homepage/videoListResults/VideoListResults";
import "../../components/DarkMode/DarkMode.css";
import ButtonGroup from "../../components/Homepage/ButtonGroup/ButtonGroup";
import { useUser } from "../../context/UserContext";

// Homepage component
const App = () => {
  const { fetchAllUsers } = useUser(); // Fetch all users from context

  useEffect(() => {
    fetchAllUsers(); // Fetch all users when component mounts
  }, []);

  return (
    <div className="container-fluid">
      <div className="login-button-container"></div>
      <div className="row">
        <div className="col main-content">
          <ButtonGroup />
          <div className="mt-5">
            <VideoListResults />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App; // Exporting the App component as default
