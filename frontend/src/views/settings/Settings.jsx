import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Typography,
  Select,
  Flex,
  Divider,
  Row,
  Col,
  Dropdown,
} from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import {
  getAccountDetails,
  updateUserAccount,
  deleteUserAccount,
} from "../../apiService";
import { TableComponent } from "../../components/table/TableComponent";
import VerticalSpace from "../../components/vertical-space";
import { Message } from "../../components/message/Message";

const { Title } = Typography;
const { Search } = Input;

export function Settings() {
  const [users, setUsers] = useState([]);
  const [totalCounts, setTotalCounts] = useState({
    total: 0,
    staff: 0,
    doctor: 0,
    admin: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch account details when search or filter changes
    getAccountDetails(searchQuery, filter)
      .then((response) => {
        console.log("response: ", response);
        setTotalCounts((prev) => ({
          ...prev,
          total: response.totalUsersCount,
          staff: response.staffCount,
          doctor: response.doctorCount,
          admin: response.adminCount,
        }));
        setUsers(response.users);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  }, [searchQuery, filter, loading]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
  };

  const handleEdit = (user) => {
    console.log("user: ", user);
    setEditingUser(user);
    form.setFieldsValue({
      displayName: user.displayname,
      username: user.username,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteUserAccount({ userId: id });
      if (response.status === 200) {
        Message("success", "User deleted successfully", 2);
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        Message("error", response.error, 5);
      }
    } catch (error) {
      Message("error", "Failed to delete user", 5);
      console.error("Failed to delete user:", error);
    }
  };

  const handleSave = async () => {
    try {
        setLoading(true);
      const values = await form.validateFields();

      const data = {
        userId: editingUser._id,
        displayName: values.displayName,
        username: values.username,
        role: values.role,
        password: values.password,
        newPassword: values.newPassword,
      };
      const response = await updateUserAccount(data);

      if (response.status === 200) {
        Message("success", "User information updated successfully", 2);
      } else {
        Message("error", response.error, 5);
      }
      setIsModalOpen(false);
    } catch (errorInfo) {
      Message("error", "Failed to update user information", 5);
      console.log("Validation Failed:", errorInfo);
    } finally {
        setLoading(false);
        }
  };

  const columns = [
    { title: "Display Name", dataIndex: "displayname", key: "displayname" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        // Menu items for dropdown actions
        const menuItems = [
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined />,
            onClick: () => handleEdit(record), // Trigger the edit function
          },
          {
            key: "delete",
            label: "Delete",
            icon: <DeleteOutlined style={{ color: "red" }} />,
            onClick: () => handleDelete(record._id), // Trigger the delete function
          },
        ];

        return (
          <Dropdown
           menu={{ items: menuItems }} 
            trigger={["click"]} // Trigger dropdown on click
          >
            {/* Dropdown button */}
            <Button type="link" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Flex vertical>
      <Title level={2}>User Management</Title>

      {/* Total users and filtered users count */}
      <Space style={{ marginBottom: 20 }}>
        <Card title="Total Users" bordered={false} style={{ width: 200 }}>
          <Title level={3}>{totalCounts.total || "N/A"}</Title>
        </Card>
        <Card title="Admins" bordered={false} style={{ width: 200 }}>
          <Title level={3}>{totalCounts.admin || "N/A"}</Title>
        </Card>
        <Card title="Doctors" bordered={false} style={{ width: 200 }}>
          <Title level={3}>{totalCounts.doctor || "N/A"}</Title>
        </Card>
        <Card title="Staff" bordered={false} style={{ width: 200 }}>
          <Title level={3}>{totalCounts.staff || "N/A"}</Title>
        </Card>
      </Space>

      <Divider />

      {/* Search and filter section */}
      <Row gutter={24}>
        <Col span={8}>
          <Search placeholder="Search by name" onChange={handleSearch} />
        </Col>
        <Col gutter={6}>
          <Select
            placeholder="Filter by role"
            onChange={setFilter}
            style={{ width: 200 }}
            allowClear
          >
            <Select.Option value="All">All</Select.Option>
            <Select.Option value="Staff">Staff</Select.Option>
            <Select.Option value="Doctor">Doctor</Select.Option>
            <Select.Option value="Admin">Admin</Select.Option>
          </Select>
        </Col>
      </Row>

      <VerticalSpace height="20px" />

      {/* Table displaying the users */}
      <TableComponent columns={columns} data={users} loading={loading} />

      {/* Modal to edit user */}
      <Modal
        title="Edit User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Display Name"
            name="displayName"
            rules={[{ required: true, message: "Display name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="User Name" name="username">
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="User Role"
            name="role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select defaultValue="Staff">
              <Select.Option value="Staff">Staff</Select.Option>
              <Select.Option value="Doctor">Doctor</Select.Option>
              <Select.Option value="Admin">Admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Current Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
}
