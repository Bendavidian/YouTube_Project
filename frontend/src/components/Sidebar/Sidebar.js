import { useLocation } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdContactPage } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import "./Sidebar.css";
import { useState } from "react";
import LeftMenu from "../Homepage/LeftMenu/LeftMenu";

// Sidebar component for navigation
const Sidebar = () => {
  const location = useLocation(); // Get the current location from the router
  const [open, setOpen] = useState(false); // State to manage sidebar open/close status
  const isHomepage = location.pathname === "/"; // Check if the current path is homepage

  return (
    <div
      className={`${
        isHomepage ? "" : "padding-left padding-right"
      } sidebar-container`} // Apply padding if not on homepage
    >
      {!open ? (
        <CiMenuBurger
          onClick={() => setOpen((o) => !o)} // Toggle sidebar open/close
          className="icon-hover"
          style={{ cursor: "pointer" }}
        />
      ) : (
        <RxCross1
          onClick={() => setOpen((o) => !o)} // Toggle sidebar open/close
          className="icon-hover"
          style={{ cursor: "pointer" }}
        />
      )}
      <div className={`left_section ${open ? "open" : "closed"}`}>
        <div style={{ marginLeft: "-100px" }}></div>
        {isHomepage && !open && (
          <div className="sidebar-icons"> {/* Show icons when on homepage and sidebar is closed */}
            <div className="icon-wrapper">
              <GoHomeFill />
              <span className="icon-label">Homepage</span>
            </div>
            <div className="icon-wrapper">
              <SiYoutubeshorts />
              <span className="icon-label">Shorts</span>
            </div>
            <div className="icon-wrapper">
              <MdOutlineSubscriptions />
              <span className="icon-label">Subscribers</span>
            </div>
            <div className="icon-wrapper">
              <MdContactPage />
              <span className="icon-label">My Page</span>
            </div>
          </div>
        )}
        {open && <LeftMenu />} {/* Render LeftMenu component when sidebar is open */}
      </div>
    </div>
  );
};

export default Sidebar; // Exporting the Sidebar component as default
