import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Button, Layout, Menu, theme, ConfigProvider, Typography, Space } from "antd";
import { useState, useEffect } from "react";
import {
  UsergroupAddOutlined,
  FolderViewOutlined,
  UpCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DeleteOutlined,
  UserAddOutlined,
  LogoutOutlined,
  DollarOutlined,
  UserOutlined
} from "@ant-design/icons";
import { LogIn } from "./views/auth/LogIn";
import { Appointments } from "./views/appointments/Appointments";
import { ViewRecords } from "./views/view-patients/ViewRecords";
import { AddPatients } from "./views/add-patients/AddPatients";
import { UpdatePatients } from "./views/update-patients/UpdatePatients";
import { DeletePatients } from "./views/delete-patients/DeletePatients";
import { ViewIncome } from "./views/view-income/ViewIncome";
import { Message } from "./components/message/Message";

const { Header, Sider } = Layout;
const { Text } = Typography;


export function CustomHeader({ collapsed, setCollapsed }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Retrieve user details from storage
    const storedUser = {
      username: sessionStorage.getItem("username"),
      displayname: sessionStorage.getItem("displayname"),
      role: sessionStorage.getItem("role"),
    };
    
    if (storedUser.username) {
      setUser(storedUser);
    }

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Determine greeting based on the time of login
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        background: "#1677ff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Sidebar Toggle Button */}
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

      {/* Real-time Date & Time */}
      <Text strong style={{ fontSize: "16px", color: "#fff" }}>
        {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
      </Text>

      {/* User Info Section */}
      {user && (
        <Space>
          <Text style={{ fontSize: "16px", color: "#fff" }} strong>{getGreeting()}, {user.displayname}!</Text>
          <Text style={{ fontSize: "16px", color: "#fff" }} type="secondary">({user.role})</Text>
          <UserOutlined style={{ fontSize: 20 }} />
        </Space>
      )}
    </Header>
  );
}

export function Sidebar({ collapsed, logOut }) {
  const location = useLocation();

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
    {
      key: "/view-income",
      icon: <DollarOutlined />,
      label: <Link to="/view-income">View Income</Link>,
    },
  ];

  return (
    <Sider
      style={{
        height: "100vh",
        backgroundColor: "#fff",
        borderRight: "1px solid #d9d9d9",
      }}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      {/* Logo Section */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#1890ff",
          background: "#fff",
          marginBottom: "16px",
        }}
      >
        {collapsed ? "🦷" : "🦷 DentalEase"}
      </div>

      {/* Main Menu */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{
          fontSize: "16px",
          borderRight: "none",
        }}
      />

    {/* Logout Button - Styled Separately */}
    <div
      style={{
        position: "absolute",
        bottom: 5,
        left: 5, // Aligns with menu item spacing
        right: 5, // Aligns with menu item spacing
        width: "calc(100% - 10px)", // Ensures it doesn't touch the edges
        textAlign: "center",
        padding: "12px 0",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        backgroundColor: "#FF4D4F", // Red background
        color: "#fff", // White text
        borderRadius: "6px", // Slightly rounded corners
      }}
      onClick={logOut}
    >
      {collapsed ? (
        <LogoutOutlined />
      ) : (
        <span>
          <LogoutOutlined /> Logout
        </span>
      )}
    </div>
    </Sider>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { Sider, Content } = Layout;
  const location = useLocation();
  const isAuthenticated = sessionStorage.getItem("token") !== null;

  const borderRadiusLG = "25px";
  const colorBgContainer = theme === "dark" ? "#b0ccfc" : "#fff";

  const logOut = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login"; // Force logout
  };

  // Show only the login page if the user is not authenticated
  // if (!isAuthenticated) {
  //   return <LogIn />;
  // }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3687FF",
        },
      }}
    >
    {!isAuthenticated ? (
      <LogIn />
    ) : (      <Layout style={{ height: "100vh", backgroundColor: "#000" }}>
        <Sidebar collapsed={collapsed} logOut={logOut} />
        <Layout>
          <CustomHeader collapsed={collapsed} setCollapsed={setCollapsed} />
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
              <Route path="/view-income" element={<ViewIncome />} />
              <Route path="*" element={<Navigate to="/appointments" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>)}
    </ConfigProvider>
  );
}

export default App;
