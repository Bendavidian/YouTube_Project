import React, { useContext } from "react";
import "./Homepage.css";
import LeftMenu from "../../components/Homepage/LeftMenu/LeftMenu";
import VideoListResults from "../../components/Homepage/videoListResults/VideoListResults";
import "../../components/DarkMode/DarkMode.css";
import ButtonGroup from "../../components/Homepage/ButtonGroup/ButtonGroup";
import { OpenSidebarContext } from "../../context/OpenSidebarContext";

const App = () => {
  const { open } = useContext(OpenSidebarContext); // Sidebar context

  return (
    <div className="container-fluid">
      <div className="login-button-container"></div>
      <div className="row">
        {open && <LeftMenu />}
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
