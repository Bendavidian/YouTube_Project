import { Link } from "react-router-dom";
import "./VideoItem.css";
import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";

function VideoItem({ title, author, views, createdAt, thumbnail, _id: id }) {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className="col-lg-3 col-md-4 col-sm-6">
      <Link to={`/video/${id}`} className={`card ${darkMode && "dark"}`}>
        <div className="wrapper">
          <img src={thumbnail} className="card-img-top" alt="..."></img>
        </div>
        <div className="card-body">
          <p className="card-title" style={{ textDecoration: 'none' }}>{title}</p>
          <h5 className="card-text" style={{ textDecoration: 'none' }}>{author?.username}</h5>
          <h5 className="card-text" style={{ textDecoration: 'none' }}>
            {views.toLocaleString()} views • {new Date(createdAt).toLocaleDateString()}
          </h5>
        </div>
      </Link>
    </div>
);
}

export default VideoItem;
