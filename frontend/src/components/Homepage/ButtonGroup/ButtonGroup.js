import React, { useContext } from "react";
import "./ButtonGroup.css";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { useLocation } from "react-router-dom";

// ButtonGroup component for displaying a group of category buttons
const ButtonGroup = () => {
  const { darkMode } = useContext(DarkModeContext); // Get dark mode state from context
  const location = useLocation(); // Get current location from router

  return (
    <div className={`row bg-white ${darkMode && "dark"}`}>
      <button
        type="button"
        className={`btn-t col m-3 tag active ${
          location.pathname === "/" && "active"
        }`}
      >
        All
      </button>
      <button type="button" className="btn-t col m-3 tag">
        Music
      </button>
      <button type="button" className="btn-t col m-3 tag">
        Mixes
      </button>
      <button type="button" className="btn-t col m-3 tag">
        News
      </button>
      <button type="button" className="btn-t col m-3 tag">
        Views
      </button>
      <button type="button" className="btn-t col m-3 tag">
        Gaming
      </button>
      <button type="button" className="btn-t col m-3 tag">
        Scenes
      </button>
      <button type="button" className="btn-t col m-3 tag">
        Live
      </button>
      <button type="button" className="btn-t col m-3 tag">
        New
      </button>
    </div>
  );
};

export default ButtonGroup; // Exporting the ButtonGroup component as default
