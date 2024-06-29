// Load videos from localStorage
const loadVideos = () => {
  const videos = localStorage.getItem('videos');
  return videos ? JSON.parse(videos) : [];
};

// Add a new video to localStorage
export const addVideo = (video) => {
  const videos = loadVideos();
  videos.push(video);
  localStorage.setItem('videos', JSON.stringify(videos));
};

// Get all videos from localStorage
export const getVideos = () => {
  return loadVideos();
};

// Get a video by its ID from localStorage
export const getVideoById = (id) => {
  const videos = loadVideos();
  return videos.find(video => video.id === id);
};
