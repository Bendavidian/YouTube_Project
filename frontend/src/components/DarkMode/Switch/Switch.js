import React from "react";
import "./Switch.css";

function Switch({ isOn, handleToggle }) {
  return (
    <div className="toggle-switch">
      <input
        checked={isOn} // Set checked state based on isOn prop
        onChange={handleToggle} // Call handleToggle function on change
        className="checkbox"
        id={`toggle-new`} // Unique ID for the input
        type="checkbox"
      />
      <label className="slider" htmlFor={`toggle-new`}>
        <span className="icon"></span>
      </label>
    </div>
  );
}

export default Switch;
