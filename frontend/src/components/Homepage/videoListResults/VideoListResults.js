import VideoItem from "../VideoItem/VideoItem";
import "./VideoListResults.css";
import { useVideoContext } from "../../../context/VideoContext";
import { Card, Col, Container, Row } from "react-bootstrap";

function VideoListResults() {
  const { fetchedVideos } = useVideoContext();

  if (fetchedVideos.length) {
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
    return <div className="video-list-results">No videos found</div>;
  }
}

export default VideoListResults;
