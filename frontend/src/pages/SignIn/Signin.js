import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Field from "../../components/Field";
import Switch from "../../components/DarkMode/Switch/Switch";
import "../../components/DarkMode/DarkMode.css";
import "./SignIn.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useUser } from "../../context/UserContext";

// Signin component for user login
function Signin() {
  const [email, setEmail] = useState(""); // State for email input
  const [suggestions, setSuggestions] = useState([]); // State for email suggestions
  const [password, setPassword] = useState(""); // State for password input
  const [type, setType] = useState("password"); // State for input type (password/text)
  const [icon, setIcon] = useState(eyeOff); // State for icon (eye/eyeOff)
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [hidePassword, setHidePassword] = useState(false); // State for hiding password

  const navigate = useNavigate(); // Hook to navigate between routes
  const { login } = useUser(); // Get login function from user context

  // Function to toggle password visibility
  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
      setHidePassword(false);
    } else {
      setIcon(eyeOff);
      setType("password");
      setHidePassword(true);
    }
  };

  // Function to handle field changes
  const handleFieldChange = (name, value) => {
    if (name === "Email:") {
      setEmail(value);

      // Provide suggestions based on input
      if (value) {
        const users = JSON.parse(sessionStorage.getItem("users")) || [];
        const filteredSuggestions = users
          .filter((user) => user.email.startsWith(value))
          .map((user) => user.email);
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    } else if (name === "Password:") {
      setPassword(value);
    }
  };

  // Function to handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setEmail(suggestion);
    setSuggestions([]);
  };

  // Function to clear all input fields
  const clearFields = () => {
    setEmail("");
    setPassword("");
  };

  // Function to handle user login
  const userLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login with email:", email);

    try {
      await login(email, password); // Attempt login with provided email and password
      navigate("/"); // Navigate to the homepage on successful login
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.response.data.message); // Display error message
      clearFields(); // Clear input fields
    }
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  };

  return (
    <div className="container mt-5  text-center d-flex flex-column align-items-center justify-content-center login-container">
      <div className="d-flex justify-content-between flex-row-reverse w-100 align-items-center">
        <Switch isOn={darkMode} handleToggle={toggleDarkMode} />
        <Link to="/" className="logo-link">
          <img
            src="/youtube.svg"
            alt="Youtube Logo"
            className="img-fluid img-logo"
          />
        </Link>
      </div>
      <div className="col-md-6">
        <h1 className="fw-bold mb-4 login-title">Login</h1>
        <form onSubmit={userLogin}>
          <Field
            type="text"
            name="Email:"
            placeholder="Email"
            value={email}
            onChange={handleFieldChange} // Handle email field change
            className="form-control form-control-lg special-font"
          />
          {suggestions.length > 0 && (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)} // Handle suggestion click
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <div className="position-relative">
            <Field
              type={type}
              name="Password:"
              placeholder="Password"
              value={password}
              onChange={handleFieldChange} // Handle password field change
              autoComplete="current-password"
              className={`form-control form-control-lg special-font ${
                hidePassword && "hide-password"
              }`}
            />
            <span className="password-icon" onClick={handleToggle}>
              <Icon icon={icon} size={25} /> {/* Password visibility toggle icon */}
            </span>
          </div>
          <button type="submit" className="btn btn-custom mt-3 mb-3">
            <div className="text-container">
              <span className="text">Login</span>
            </div>
          </button>
        </form>
        <p className="mt-3">
          Haven't registered yet?{" "}
          <Link to="/register" className="text-primary fw-bold">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin; // Exporting the Signin component as default
