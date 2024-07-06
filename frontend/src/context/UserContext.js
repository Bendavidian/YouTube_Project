import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create a context for user data
const UserContext = createContext();

// Provider component to wrap the application and provide user context
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State for current user
  const [users, setUsers] = useState([]); // State for all users
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") // Initialize access token from local storage
  );

  // Fetch user details if access token is available
  useEffect(() => {
    if (accessToken) {
      fetchUserDetails(accessToken);
    }
  }, [accessToken]);

  // Function to fetch current user details
  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data); // Set user state with fetched data
    } catch (error) {
      console.error("Error fetching user details:", error);
      if (error.response.status === 401) {
        refreshAccessToken(); // Refresh access token if unauthorized
      }
    }
  };

  // Function to fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      setUsers(response.data); // Set users state with fetched data
    } catch (error) {
      console.error("Error fetching all users", error);
    }
  };

  // Function to refresh access token
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/refresh-token",
        {
          refreshToken: localStorage.getItem("refreshToken"), // Use refresh token from local storage
        }
      );
      setAccessToken(response.data.accessToken); // Update access token
      localStorage.setItem("accessToken", response.data.accessToken); // Save new access token to local storage
      fetchUserDetails(response.data.accessToken);// Fetch user details with new token
    } catch (error) { 
      console.error("Error refreshing access token:", error);
      logout(); // Logout on error
    }
  };

  // Function to handle user login
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );
      setAccessToken(response.data.accessToken); // Set access token
      localStorage.setItem("accessToken", response.data.accessToken); // Save access token to local storage
      localStorage.setItem("refreshToken", response.data.refreshToken); // Save refresh token to local storage
      fetchUserDetails(response.data.accessToken); // Fetch user details with access token
    } catch (error) {
      console.error("Error logging in:", error);
      throw error; // Throw error to be handled by the calling function
    }
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null); // Clear user state
    setAccessToken(null); // Clear access token
    localStorage.removeItem("accessToken"); // Remove access token from local storage
    localStorage.removeItem("refreshToken"); // Remove refresh token from local storage
  }; 

  return (
    <UserContext.Provider
      value={{ user, users, login, logout, setUser, fetchAllUsers }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
