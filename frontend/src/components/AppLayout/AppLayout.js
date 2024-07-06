import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./AppLayout.css";

// AppLayout component for the main layout of the application
const AppLayout = () => {
  const { darkMode } = useContext(DarkModeContext); // Get dark mode state from context

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

export default AppLayout; // Exporting the AppLayout component as default
