import "./LogIn.css";
import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input } from "antd";
import Button from "../../components/button/Button";

export function LogIn() {
  const [buttonState, setButtonState] = useState(true);

  console.log(buttonState);

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
          <div
            className="block"
            onClick={() => setButtonState(false)}
            style={{
              marginRight: "2.5px",
              backgroundColor: buttonState ? "#aaccff" : "#8eaad4",
            }}
          >
            <img src="/login/staff.svg" alt="staff" />
            <p className="block-text">Staff</p>
          </div>
          <div className="or-container">
            <img src="/login/or.svg" alt="or" className="or-image" />
          </div>
          <div
            className="block"
            onClick={() => setButtonState(true)}
            style={{
              marginLeft: "2.5px",
              backgroundColor: buttonState ? "#8eaad4" : "#aaccff",
            }}
          >
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
          <Button text={"LogIn"} width={"100px"} shadow={false} />
        </div>
      </div>
    </div>
  );
}
