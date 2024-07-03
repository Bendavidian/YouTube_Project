// src/api/axios.js
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Your API base URL
});

// Function to refresh the token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const response = await axios.post(
        "http://localhost:8080/api/auth/refresh-token",
        {
          refreshToken,
        }
      );

      const accessToken = response.data.accessToken;
      localStorage.setItem("accessToken", accessToken);

      return accessToken;
    }
  } catch (error) {
    console.error("Failed to refresh token", error);
    throw error;
  }
};

// Add a request interceptor to attach the token
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken");
    if (!token) {
      token = await refreshToken();
    }
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
