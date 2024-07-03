import { useUser } from "../../../context/UserContext";
import "./LeftMenu.css";

function MenuItem({ logoName, buttonName, darkMode, username, avatar }) {
  const { user } = useUser();
  if (buttonName === "Your videos" && !user) {
    return;
  }
  return (
    <li
      className={`list-group-item border-none d-flex justify-content-between align-items-center ${
        darkMode && "dark"
      }`}
    >
      {logoName ? (
        <i className={`${logoName} icon-size`}></i>
      ) : (
        <img
          src={avatar}
          alt={username}
          style={{
            height: "40px",
            width: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
      <span className="w-100 m-1 ms-3"> {buttonName || username} </span>
    </li>
  );
}

export default MenuItem;
