import { FaRegCircleUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import UploadModal from "../UploadModal/UploadModal";
import Switch from "../DarkMode/Switch/Switch";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useVideoContext } from "../../context/VideoContext";
import "./Navbar.css";
import { useUser } from "../../context/UserContext";

const Navbar = () => {
  const [search, setSearch] = useState(""); // State for search input

  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); // Dark mode context
  const { filterVideos } = useVideoContext(); // Video context
  const { user, logout } = useUser();

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    filterVideos(event.target.value);
  };

  // Handle user signout
  const handleSignout = () => {
    logout();
  };

  return (
    <div className={`navbar ${darkMode && "dark"}`}>
      <div className="gap">
        <Link to="/">
          <img
            className="logo"
            src="/YouTube_Logo_2017.png"
            alt="youtube-logo"
          />
        </Link>
        <div className="header-left">
          {user ? (
            <Link
              to={`/videos/${user._id}`}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img className="user-photo" src={user.avatar} alt="user photo" />
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                Welcome {user.username}
              </span>
            </Link>
          ) : (
            <>
              <FaRegUserCircle size={30} style={{ marginRight: "13px" }} />
              <span style={{ fontWeight: "bold" }}>Welcome guest</span>
            </>
          )}
        </div>
      </div>
      <div className="search">
        <CiSearch className="logo" />
        <input
          type="text"
          className="search-bar"
          placeholder="Search"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div className="navbar-right">
        <Switch isOn={darkMode} handleToggle={toggleDarkMode} />
        {user && (
          <div className="AddVideo-btn" data-label="Add Video">
            <UploadModal />
          </div>
        )}
        {user && (
          <Link
            to="/me"
            className="settings-btn"
            style={{ textDecoration: "none" }}
            data-label="Settings"
          >
            <IoSettingsOutline size={23} />
          </Link>
        )}
        <button className="bell-btn" data-label="Notifications">
          <i className="bi bi-bell"></i>
        </button>
        {user ? (
          <button className="btn-sign" onClick={handleSignout}>
            Sign Out
          </button>
        ) : (
          <Link to="/login" className="btn-sign">
            <FaRegCircleUser />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
