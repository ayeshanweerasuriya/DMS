import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import {
  Button,
  Layout,
  Menu,
  theme,
  ConfigProvider,
  Typography,
  Space,
  Avatar,
} from "antd";
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
  UserOutlined,
} from "@ant-design/icons";
import { LogIn } from "./views/auth/LogIn";
import { Appointments } from "./views/appointments/Appointments";
import { ViewRecords } from "./views/view-patients/ViewRecords";
import { AddPatients } from "./views/add-patients/AddPatients";
import { UpdatePatients } from "./views/update-patients/UpdatePatients";
import { DeletePatients } from "./views/delete-patients/DeletePatients";
import { ViewIncome } from "./views/view-income/ViewIncome";
import { NotFound } from "./views/not-found/NotFound";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { DateTime } from "luxon";

const { Header, Sider } = Layout;
const { Text } = Typography;

export function CustomHeader({ collapsed, setCollapsed }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const formattedDateTime = DateTime.now().toFormat(
    "EEEE, MMM dd, yyyy - hh:mm a"
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const storedUser = {
      username: sessionStorage.getItem("username"),
      displayname: sessionStorage.getItem("displayname"),
      role: sessionStorage.getItem("role"),
    };

    if (storedUser.username) setUser(storedUser);

    return () => clearInterval(timer);
  }, []);

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
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: 16,
          width: 64,
          height: 64,
          background: "transparent",
          border: "none",
          color: "#fff",
        }}
      />

      <Text strong style={{ fontSize: 16, color: "#fff", marginRight: "20px" }}>
        {formattedDateTime}
      </Text>

      {user && (
        <Space>
          <Text
            strong
            style={{
              fontSize: 16,
              color: "#fff",
              marginRight: "10px",
            }}
          >
            {getGreeting()}, {user.displayname}!
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#fff",
              fontWeight: "normal",
              marginRight: "15px",
            }}
            type="secondary"
          >
            ({user.role})
          </Text>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{
              backgroundColor: "#fff",
              color: "#1677ff",
              fontSize: 20,
            }}
          />
        </Space>
      )}
    </Header>
  );
}

export function Sidebar({ collapsed, logOut }) {
  const location = useLocation();
  const [showText, setShowText] = useState(false);
  const userRole = sessionStorage.getItem("role");

  const menuItems = [
    {
      key: "/appointments",
      icon: <UsergroupAddOutlined />,
      label: <Link to="/appointments">Appointments</Link>,
      allowedRoles: ["Staff", "Admin"],
    },
    {
      key: "/add-patients",
      icon: <UserAddOutlined />,
      label: <Link to="/add-patients">Add Patients</Link>,
      allowedRoles: ["Staff", "Admin"],
    },
    {
      key: "/view-records",
      icon: <FolderViewOutlined />,
      label: <Link to="/view-records">Patient Records</Link>,
      allowedRoles: ["Doctor", "Admin", "Staff"],
    },
    
    {
      key: "/update-patients",
      icon: <UpCircleOutlined />,
      label: <Link to="/update-patients">Update Patients</Link>,
      allowedRoles: ["Doctor", "Staff", "Admin"],
    },
    {
      key: "/delete-patients",
      icon: <DeleteOutlined />,
      label: <Link to="/delete-patients">Delete Patients</Link>,
      allowedRoles: ["Staff", "Admin"],
    },
    {
      key: "/view-income",
      icon: <DollarOutlined />,
      label: <Link to="/view-income">View Income</Link>,
      allowedRoles: ["Doctor", "Admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  useEffect(() => {
    if (!collapsed) {
      const timer = setTimeout(() => setShowText(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [collapsed]);

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
        {collapsed ? "🦷" : `🦷 ${showText ? "DentalEase" : ""}`}
      </div>

      {/* Main Menu */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={filteredMenuItems}
        style={{
          fontSize: "16px",
          borderRight: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 5,
          left: 5,
          right: 5,
          width: "calc(100% - 10px)",
          textAlign: "center",
          padding: "12px 0",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#FF4D4F",
          color: "#fff",
          borderRadius: "6px",
        }}
        onClick={logOut}
      >
        {collapsed ? (
          <LogoutOutlined />
        ) : (
          <span>
            <LogoutOutlined /> {showText ? "Logout" : ""}
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
    window.location.href = "/login";
  };

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
      {isAuthenticated && (
        <Layout style={{ height: "100vh", backgroundColor: "#000" }}>
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
                <Route
                  path="/"
                  element={
                    <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
                      <Navigate to="/appointments" replace />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/appointments"
                  element={
                    <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
                      <Appointments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/view-records"
                  element={
                    <ProtectedRoute allowedRoles={["Doctor", "Admin", "Staff"]}>
                      <ViewRecords />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-patients"
                  element={
                    <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
                      <AddPatients />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/update-patients"
                  element={
                    <ProtectedRoute allowedRoles={["Doctor", "Staff", "Admin"]}>
                      <UpdatePatients />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/delete-patients"
                  element={
                    <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
                      <DeletePatients />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/view-income"
                  element={
                    <ProtectedRoute allowedRoles={["Doctor", "Admin"]}>
                      <ViewIncome />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      )}
    </ConfigProvider>
  );
}

export default App;
