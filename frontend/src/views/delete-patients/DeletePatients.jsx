import { Divider, Typography, Space, Row, Col, Input, Flex } from "antd";
import { TableComponent } from "../../components/table/TableComponent";
import { DeleteFilled } from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

export function DeletePatients() {

  const handleDelete = (key) => {
    console.log("Delete patient with ID:", key);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "key",
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
        <Flex align="center" justify="center">
        <DeleteFilled style={{color: "red"}} onClick={() => handleDelete(record.key)}/>
        </Flex>
      )
    },
  ];

  const data = [
    {
      key: "1",
      name: "John Doe",
      contact: "0777788899",
      date: "2024/06/30",
    },
    {
      key: "2",
      name: "John Doe",
      contact: "0777788899",
      date: "2024/06/30",
    },
    // Add more rows as needed
  ];

  return (
    <Flex vertical>
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
        <TableComponent
          columns={columns}
          data={data}
        />
      </Space>
    </Flex>
  );
}

export default DeletePatients;
