import "./LogIn.css";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input } from "antd";
import Button from "../../components/button/Button";

export function LogIn() {
  return (
    <div className="login-component">
      <div className="logo-name">
        <img src="/login/logo.png" alt="logo" />
        <h1>{"-DentalEase-"}</h1>
        <h2>{"Dental Management System"}</h2>
      </div>
      <div className="login">
        <h3>Choose your account type</h3>
        <div style={{ display: "flex", marginTop: "10px" }}>
          <div className="block" style={{ marginRight: "2.5px" }}>
            <img src="/login/staff.svg" alt="staff" />
            <p className="block-text">Staff</p>
          </div>
          <div className="or-container">
            <img src="/login/or.svg" alt="or" className="or-image" />
          </div>
          <div className="block" style={{ marginLeft: "2.5px" }}>
            <img src="/login/doctor.svg" alt="doctor" />
            <p className="block-text">Doctor</p>
          </div>
        </div>
        <div className="login-form">
          <Input placeholder="UserName" />
          <br />
          <Input.Password
            placeholder="input password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          <Button text={"LogIn"} />
        </div>
      </div>
    </div>
  );
}
