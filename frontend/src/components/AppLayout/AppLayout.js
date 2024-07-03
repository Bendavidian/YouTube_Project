import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./AppLayout.css";

const AppLayout = () => {
  const { darkMode } = useContext(DarkModeContext); // Dark mode context

  return (
    <main className={darkMode && "dark"}>
      <div className="app-body">
        <Sidebar />
        <div>
          <Navbar />
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AppLayout;
