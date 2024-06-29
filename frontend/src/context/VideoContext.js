import React, { createContext, useContext, useState, useEffect } from "react";

const VideoContext = createContext();

export const useVideoContext = () => useContext(VideoContext);

export const VideoProvider = ({ children }) => {
  const [fetchedVideos, setFetchedVideos] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("http://localhost:8080/api/videos");
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const videos = await response.json();
        setFetchedVideos(videos);
        setVideos(videos);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    }

    fetchVideos();
  }, []);

  const filterVideos = (searchTerm) => {
    if (!searchTerm) {
      setFetchedVideos(videos);
      return;
    }

    const filteredVideos = videos.filter((video) => {
      return video.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFetchedVideos(filteredVideos);
  };

  return (
    <VideoContext.Provider
      value={{ fetchedVideos, setFetchedVideos, filterVideos }}
    >
      {children}
    </VideoContext.Provider>
  );
};
