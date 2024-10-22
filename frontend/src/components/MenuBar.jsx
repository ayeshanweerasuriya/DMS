import { Link } from "react-router-dom";

const MenuBar = () => {
  console.log("MenuBar");
  return (
    <div className="menu-bar">
      <ul>
        <li>
          <Link to="/appointments">Appointments</Link>
        </li>
        <li>
          <Link to="/view-records">View Records</Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuBar;
