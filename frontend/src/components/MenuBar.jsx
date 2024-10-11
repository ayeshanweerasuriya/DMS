import { useState } from "react";
import {
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Menu, Avatar, Flex } from "antd";
const items = [
  {
    key: "1",
    icon: <PieChartOutlined />,
    label: "Appointments",
  },
  {
    key: "2",
    icon: <DesktopOutlined />,
    label: "View Records",
  },
  {
    key: "3",
    icon: <ContainerOutlined />,
    label: "Add Patients",
  },
  {
    key: "4",
    icon: <ContainerOutlined />,
    label: "Update Patients",
  },
  {
    key: "5",
    icon: <ContainerOutlined />,
    label: "Delete Patients",
  },
  {
    key: "6",
    icon: <ContainerOutlined />,
    label: "LogOut",
  },
];

const MenuBar = () => {
  const onClick = (e) => {
    console.log("click ", e);
  };

  return (
    <div>
      <Flex gap="middle" horizontal align="center">
        <Avatar
          style={{
            backgroundColor: "#87d068",
            verticalAlign: "middle",
          }}
          size="large"
          gap={"20px"}
        >
          {"K"}
        </Avatar>
        <h4>{"kanjipani@gmail.com"}</h4>
      </Flex>
      <Menu
        onClick={onClick}
        style={{
          width: 256,
        }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
    </div>
  );
};
export default MenuBar;
