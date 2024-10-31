import { Routes, Route, Link } from "react-router-dom";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import {
  UsergroupAddOutlined,
  FolderViewOutlined,
  UpCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Appointments } from "./views/appointments/Appointments";
import { ViewRecords } from "./views/view-patients/ViewRecords";
import { AddPatients } from "./views/add-patients/AddPatients";
import { UpdatePatients } from "./views/update-patients/UpdatePatients";
import { DeletePatients } from "./views/delete-patients/DeletePatients";

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Sider, Content } = Layout;

  const borderRadiusLG = "25px";
  const colorBgContainer = theme === "dark" ? "#b0ccfc" : "#fff";

  const menuItems = [
    {
      key: "1",
      icon: <UsergroupAddOutlined />,
      label: <Link to="/appointments">Appointments</Link>,
    },
    {
      key: "2",
      icon: <FolderViewOutlined />,
      label: <Link to="/view-records">View Records</Link>,
    },
    {
      key: "3",
      icon: <UserAddOutlined />,
      label: <Link to="/add-patients">Add Patients</Link>,
    },
    {
      key: "4",
      icon: <UpCircleOutlined />,
      label: <Link to="/update-patients">Update Patients</Link>,
    },
    {
      key: "5",
      icon: <DeleteOutlined />,
      label: <Link to="/delete-patients">Delete Patients</Link>,
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
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
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />
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
          }}
        >
          <Routes>
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/view-records" element={<ViewRecords />} />
            <Route path="/add-patients" element={<AddPatients />} />
            <Route path="/update-patients" element={<UpdatePatients />} />
            <Route path="/delete-patients" element={<DeletePatients />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
