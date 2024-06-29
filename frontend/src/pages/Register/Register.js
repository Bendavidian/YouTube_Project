import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Field from "../../components/Field";
import Switch from "../../components/DarkMode/Switch/Switch";
import "../../components/DarkMode/DarkMode.css";
import "./Register.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [fullName, setFullName] = useState(""); // State for full name input
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password input
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture file
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  const navigate = useNavigate(); // Hook to navigate between routes

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: "",
  });

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  };

  // Function to handle field changes
  const handleFieldChange = (name, value) => {
    if (name === "Full Name:") {
      setFullName(value);
    } else if (name === "Email:") {
      setEmail(value);
    } else if (name === "Password:") {
      setPassword(value);
    } else if (name === "Confirm Password:") {
      setConfirmPassword(value);
    }
  };

  // Function to handle profile picture file change
  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  // Function to clear all input fields
  const clearFields = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setProfilePicture(null);
  };

  // Function to handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePicture: "",
    };

    let hasError = false;

    // Check if fields are empty
    if (!fullName) {
      newErrors.fullName = "Full name is required.";
      hasError = true;
    }

    if (!email) {
      newErrors.email = "Email is required.";
      hasError = true;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
      hasError = true;
    }

    if (!profilePicture) {
      newErrors.profilePicture = "Profile picture is required.";
      hasError = true;
    }

    // Check if email is in the correct format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
      setEmail("");
    }

    // Check if passwords match
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      hasError = true;
    }

    // Check if password meets the requirements
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    if (password && !passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.";
      hasError = true;
      setPassword("");
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("username", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", profilePicture);

    try {
      // Make API call to register the user
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle successful registration
      if (response.data.token) {
        console.log("User registered successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during registration:", error.response.data.message);
      alert("Registration failed: " + error.response.data.message);
    }
  };

  return (
    <div className="container mt-5 text-center d-flex flex-column align-items-center justify-content-center login-container">
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
        <h1 className="fw-bold mb-4 register-title">Register</h1>
        <form onSubmit={handleRegister}>
          <Field
            name="Full Name:"
            value={fullName}
            onChange={handleFieldChange}
            className="form-control form-control-lg custom-field"
          />
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}
          <Field
            name="Email:"
            value={email}
            onChange={handleFieldChange}
            className="form-control form-control-lg custom-field"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
          <Field
            type="password"
            name="Password:"
            value={password}
            onChange={handleFieldChange}
            className="form-control form-control-lg custom-field"
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
          <Field
            type="password"
            name="Confirm Password:"
            value={confirmPassword}
            onChange={handleFieldChange}
            className="form-control form-control-lg custom-field"
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}
          <div className="mb-3">
            <label className="form-label label-signup">
              Profile Picture:
              <input
                className="form-control"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </label>
            {errors.profilePicture && (
              <p className="error-text">{errors.profilePicture}</p>
            )}
          </div>
          <button className="btn btn-custom mt-3 mb-3" type="submit">
            <div className="text-container">
              <span className="text">Register</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
