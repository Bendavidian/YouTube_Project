import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import Navbar from "../Navbar/Navbar";

const AppLayout = () => {
  const { darkMode } = useContext(DarkModeContext); // Dark mode context

  return (
    <main className={darkMode && "dark"}>
      <Navbar />
      <Outlet />
    </main>
  );
};

export default AppLayout;
