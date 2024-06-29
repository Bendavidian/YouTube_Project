import VideoItem from "../VideoItem/VideoItem";
import "./VideoListResults.css";
import { useVideoContext } from "../../../context/VideoContext";

function VideoListResults() {
  const { fetchedVideos } = useVideoContext();

  if (fetchedVideos.length) {
    const videoList = fetchedVideos.map((video, key) => {
      return <VideoItem {...video} key={key} />;
    });

    return <div className="row gx-3 ">{videoList}</div>;
  } else {
    return <div className="video-list-results">No videos found</div>;
  }
}
export default VideoListResults;
