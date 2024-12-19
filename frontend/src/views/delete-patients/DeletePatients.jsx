import { Divider, Typography, Space, Row, Col, Button, Input, Tooltip, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

export function DeletePatients() {

  const handleDelete = (record) => {
    console.log("Delete patient with ID:", record.id);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Patient Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact No",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Delete Patient">
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
          </Button>
        </Tooltip>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      id: "1",
      name: "John Doe",
      contact: "0777788899",
      date: "2024/06/30",
    },
    {
      id: 2,
      name: "Jane Smith",
      contact: "987-654-3210",
      date: "2024-12-20",
    },
    // Add more rows as needed
  ];

  return (
    <Space direction="vertical" style={{ padding: "10px", width: "100%" }} size="large">
      <Typography>
        <Title level={2}>Delete Patients</Title>
        <Divider />
      </Typography>

      <Space direction="vertical" size="large">
        <Row gutter={2}>
          <Col span={100}>
            <Search
              placeholder="Search "
              enterButton
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={{ pageSize: 7 }}
        />
      </Space>
    </Space>
  );
}

export default DeletePatients;
