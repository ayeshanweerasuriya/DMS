import "./LogIn.css";
import { useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import VerticalSpace from "../../components/vertical-space";
import { login } from "../../apiService";
import { Message } from "../../components/message/Message";

export function LogIn() {
  const [buttonState, setButtonState] = useState(true);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const data = await login(values.username, values.password);
      console.log("data: ", data);
      if (data.status === 200 && data.token) {
        Message("success", "Login successful", 2);
        setTimeout(() => {
          navigate("/appointments", { replace: true });
        }, 2000);
      } else {
        Message("error", "Invalid username or password", 5);
      }
    } catch (error) {
      console.error("error: ", error);
      // Message("error", "Invalid username or password", 5);
    }
  };

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
              backgroundColor: buttonState ? "#8eaad4" : "#4187f0",
              color: buttonState ? "#000" : "#fff",
            }}
          >
            <img src="/login/staff.svg" alt="staff" style={{borderColor: "#fff"}}/>
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
              backgroundColor: buttonState ? "#4187f0" : "#8eaad4",
              color: buttonState ? "#fff" : "#000",
            }}
          >
            <img src="/login/doctor.svg" alt="doctor" />
            <p className="block-text">Doctor</p>
          </div>
        </div>
        <div className="login-form">
          <Form
            name="login"
            initialValues={{
              remember: true,
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
            onFinish={onFinish}
          >
            {/* <VerticalSpace height={'18px'} /> */}
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                style={{ height: "45px", fontSize: "16px" }}
                placeholder="Username"
              />
            </Form.Item>
            <VerticalSpace height={"10px"} />
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                style={{ height: "45px", fontSize: "16px" }}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <VerticalSpace height={"20px"} />
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
