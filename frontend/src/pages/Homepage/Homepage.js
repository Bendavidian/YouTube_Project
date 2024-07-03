import React, { useEffect } from "react";
import "./Homepage.css";
import VideoListResults from "../../components/Homepage/videoListResults/VideoListResults";
import "../../components/DarkMode/DarkMode.css";
import ButtonGroup from "../../components/Homepage/ButtonGroup/ButtonGroup";
import { useUser } from "../../context/UserContext";

const App = () => {
  const { fetchAllUsers } = useUser();

  useEffect(() => {
    fetchAllUsers();
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

export default App;
