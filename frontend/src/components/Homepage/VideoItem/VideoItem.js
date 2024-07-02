import { Link } from "react-router-dom";
import "./VideoItem.css";
import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";

function formatDuration(seconds) {
  const totalMinutes = Math.round(seconds / 60);
  const minutes = Math.floor(totalMinutes);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function VideoItem({
  title,
  author,
  views,
  createdAt,
  thumbnail,
  _id: id,
  duration,
}) {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className="">
      <Link
        to={`/video/${id}`}
        className={`card border-none rounded-0 rounded-bottom rounded-top decoration-none  ${
          darkMode && "dark"
        }`}
      >
        <div className="wrapper">
          <img src={thumbnail} className="card-img-top" alt="..."></img>
          <div className="duration">{formatDuration(duration)}</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={author?.avatar}
            alt={author?.title}
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />

          <div className="card-body">
            <p className="card-title">{title}</p>
            <h5 className="card-text">{author?.username}</h5>
            <h5 className="card-text">
              {views.toLocaleString()} views •{" "}
              {new Date(createdAt).toLocaleDateString()}
            </h5>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default VideoItem;
