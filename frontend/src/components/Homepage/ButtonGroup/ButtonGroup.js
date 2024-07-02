import React, { useContext } from "react";
import "./ButtonGroup.css";
import { DarkModeContext } from "../../../context/DarkModeContext";

const ButtonGroup = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`row bg-white ${darkMode && "dark"}`}>
      <button type="button" className="btn-t col m-3 tag">
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

export default ButtonGroup;