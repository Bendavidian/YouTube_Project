import MenuItem from "./MenuItem";
import MenuItems from "./MenuItems";
import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import "./LeftMenu.css";
import { Link } from "react-router-dom";
import { useUser } from "../../../context/UserContext";

// LeftMenu component to display a list of menu items and user members
function LeftMenu() {
  const { darkMode } = useContext(DarkModeContext); // Get dark mode state from context
  const { user, users } = useUser(); // Get current user and list of users from context


  return (
    <div>
      <ul className={`list-group ${darkMode && "dark"}`}>
        {MenuItems.map((item, key) => {
          if (item.buttonName === "Your videos") {
            return (
              <Link
                to={`/videos/${user?._id}`}
                style={{ textDecoration: "none" }}
              >
                <MenuItem {...item} key={key} darkMode={darkMode} />
              </Link>
            );
          }
          return <MenuItem {...item} key={key} darkMode={darkMode} />;
        })}
        <h2>Members</h2>
        {users.map((user, key) => {
          return (
            <Link
              to={`/videos/${user?._id}`}
              style={{ textDecoration: "none" }}
            >
              <MenuItem {...user} key={key} darkMode={darkMode} />
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
export default LeftMenu; // Exporting the LeftMenu component as default
