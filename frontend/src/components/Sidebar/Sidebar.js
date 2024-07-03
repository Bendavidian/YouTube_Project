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

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false); // Sidebar context
  const isHomepage = location.pathname === "/";

  return (
    <div
      className={`${
        isHomepage ? "" : "padding-left padding-right"
      } sidebar-container`}
    >
      {!open ? (
        <CiMenuBurger
          onClick={() => setOpen((o) => !o)}
          className="icon-hover"
          style={{ cursor: "pointer" }}
        />
      ) : (
        <RxCross1
          onClick={() => setOpen((o) => !o)}
          className="icon-hover"
          style={{ cursor: "pointer" }}
        />
      )}
      <div style={{ marginBottom: "60px" }}></div>
      {isHomepage && !open && (
        <div className="sidebar-icons">
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
      {open && <LeftMenu />}
    </div>
  );
};

export default Sidebar;
