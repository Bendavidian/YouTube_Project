import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for video data
const VideoContext = createContext();

// Custom hook to use the VideoContext
export const useVideoContext = () => useContext(VideoContext);

// Provider component to wrap the application and provide video context
export const VideoProvider = ({ children }) => {
  const [fetchedVideos, setFetchedVideos] = useState([]); // State for fetched videos
  const [videos, setVideos] = useState([]); // State for all videos

  useEffect(() => {
    // Function to fetch videos from the server
    async function fetchVideos() {
      try {
        const response = await fetch("http://localhost:8080/api/videos");
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const videos = await response.json();
        setFetchedVideos(videos); // Set fetched videos state
        setVideos(videos); // Set all videos state
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    }

    fetchVideos(); // Fetch videos on component mount
  }, []);

  // Function to filter videos based on a search term
  const filterVideos = (searchTerm) => {
    if (!searchTerm) {
      setFetchedVideos(videos); // Reset to all videos if search term is empty
      return;
    }

    const filteredVideos = videos.filter((video) => {
      return video.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFetchedVideos(filteredVideos); // Set fetched videos state to filtered videos
  };

  return (
    <VideoContext.Provider
      value={{ fetchedVideos, setFetchedVideos, filterVideos }}
    >
      {children}
    </VideoContext.Provider>
  );
};
