import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Button, Layout, Menu, theme, ConfigProvider } from "antd";
import { useState } from "react";
import {
  UsergroupAddOutlined,
  FolderViewOutlined,
  UpCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DeleteOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { LogIn } from "./views/auth/LogIn";
import { Appointments } from "./views/appointments/Appointments";
import { ViewRecords } from "./views/view-patients/ViewRecords";
import { AddPatients } from "./views/add-patients/AddPatients";
import { UpdatePatients } from "./views/update-patients/UpdatePatients";
import { DeletePatients } from "./views/delete-patients/DeletePatients";

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Sider, Content } = Layout;
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("auth") === "true";

  const borderRadiusLG = "25px";
  const colorBgContainer = theme === "dark" ? "#b0ccfc" : "#fff";

  const menuItems = [
    {
      key: "/appointments",
      icon: <UsergroupAddOutlined />,
      label: <Link to="/appointments">Appointments</Link>,
    },
    {
      key: "/view-records",
      icon: <FolderViewOutlined />,
      label: <Link to="/view-records">View Records</Link>,
    },
    {
      key: "/add-patients",
      icon: <UserAddOutlined />,
      label: <Link to="/add-patients">Add Patients</Link>,
    },
    {
      key: "/update-patients",
      icon: <UpCircleOutlined />,
      label: <Link to="/update-patients">Update Patients</Link>,
    },
    {
      key: "/delete-patients",
      icon: <DeleteOutlined />,
      label: <Link to="/delete-patients">Delete Patients</Link>,
    },
  ];

  const logOut = () => {
    localStorage.removeItem("auth");
    sessionStorage.removeItem("token");
    window.location.href = "/login"; // Force logout
  };

  // Show only the login page if the user is not authenticated
  if (!isAuthenticated) {
    return <LogIn />;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3687FF",
        },
      }}
    >
      <Layout style={{ height: "100vh", backgroundColor: "#000" }}>
        <Sider
          style={{ backgroundColor: "#fff" }}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="light"
            mode="inline"
            // defaultSelectedKeys={["1"]}
            selectedKeys={[location.pathname]}
            items={menuItems}
          />
          <div className="logout-btn" onClick={logOut}>
            <LogoutOutlined /> Logout
          </div>
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: "auto",
            }}
          >
            <Routes>
            <Route path="/" element={<Navigate to="/appointments" replace />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/view-records" element={<ViewRecords />} />
              <Route path="/add-patients" element={<AddPatients />} />
              <Route path="/update-patients" element={<UpdatePatients />} />
              <Route path="/delete-patients" element={<DeletePatients />} />
              <Route path="*" element={<Navigate to="/appointments" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
