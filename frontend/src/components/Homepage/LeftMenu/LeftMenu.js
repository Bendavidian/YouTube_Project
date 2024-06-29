import MenuItem from "./MenuItem";
import MenuItems from "./MenuItems";
import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import "./LeftMenu.css";
import { Link } from "react-router-dom";
import { useUser } from "../../../context/UserContext";

function LeftMenu() {
  const { darkMode } = useContext(DarkModeContext);
  const { user } = useUser();

  return (
    <div className="col-lg-3 col-md4 col-sm-6 left-menu">
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
      </ul>
    </div>
  );
}
export default LeftMenu;
