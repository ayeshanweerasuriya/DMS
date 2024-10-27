import { Link } from "react-router-dom";
import { Avatar, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Button from "../button/Button";
import "./MenuBar.css";
export function MenuBar() {
  return (
    <div className="menu-bar">
      <Avatar size={"large"} icon={<UserOutlined />} />
      <br />
      <span>{"tharushi@gmail.com"}</span>
      <Divider />
      <Link to="/appointments">
        <Button text={"Appointments"} />
      </Link>
      <Link to="/view-records">
        <Button text={"View Records"} />
      </Link>
      <Link to="/add-patients">
        <Button text={"Add Patients"} />
      </Link>
      <Link to="/update-patients">
        <Button text={"Update Patients"} />
      </Link>
      <Link to="/delete-patients">
        <Button text={"Delete Patients"} />
      </Link>
      <Divider />
      <Button text={"LogOut"} />
    </div>
  );
};
