import "./LeftMenu.css";



function MenuItem({ logoName, buttonName, darkMode }) {
  return (
    <li
      className={`list-group-item d-flex justify-content-between align-items-center ${
        darkMode && "dark"
      }`}
    >
      <i className={`${logoName} icon-size`}></i>
      <span className="w-100 m-1 ms-3"> {buttonName} </span>
    </li>
  );
}

export default MenuItem;