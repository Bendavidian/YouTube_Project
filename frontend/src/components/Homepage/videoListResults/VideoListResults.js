import VideoItem from "../VideoItem/VideoItem";
import "./VideoListResults.css";
import { useVideoContext } from "../../../context/VideoContext";
import { Card, Col, Container, Row } from "react-bootstrap";

// VideoListResults component for displaying a list of video items
function VideoListResults() {
  const { fetchedVideos } = useVideoContext(); // Get fetched videos from context

  if (fetchedVideos.length) {
    // Map over fetched videos and create a VideoItem for each
    const videoList = fetchedVideos.map((video, key) => (
      <Col key={key} xs={12} sm={6} md={4} lg={2} className="mb-4 custom-col">
        <VideoItem {...video} />
      </Col>
    ));

    return (
      <Container fluid>
        <Row>{videoList}</Row>
      </Container>
    );
  } else {
    return <div className="video-list-results">No videos found</div>; // Show message if no videos are found
  }
}

export default VideoListResults; // Exporting the VideoListResults component as default
