import { useState, useEffect } from "react";
import { Divider, Typography, Flex, Row, Col, Space, Button } from "antd";
import { Input, Tooltip } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { DropdownMenu } from "../../components/dropdown/DropdownMenu";
import { TableComponent } from "../../components/table/TableComponent";
import { useNavigate } from "react-router-dom";
import {getPatientList} from "../../apiService";

const { Title } = Typography;
const { Search } = Input;

export function ViewRecords() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  console.log("data: ", data);

  useEffect(() => {
    getPatientList()
      .then((response) => {
        console.log("response: ", response);
        setData(response.patients);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  }, []);

  const handleRedirect = () => {
    navigate("/add-patients");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Age",
      dataIndex: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
      ),
    }
  ];

  const handleView = (record) => {
    console.log("Viewing record:", record);
    // Add navigation logic here if needed
  };

  return (
    <Flex vertical>
      <Typography>
        <Title level={2}>Patient Records</Title>
        <Divider />
      </Typography>
      <Space direction="vertical" size="large">
        <Row gutter={24}>
          <Col span={8}>
            <Search
              placeholder="input search text"
              // onSearch={}
              enterButton
            />
          </Col>
          <Col gutter={6}>
            <DropdownMenu
              label="Filter By"
              items={[
                { key: "1", label: "Name" },
                { key: "2", label: "Age" },
                { key: "3", label: "Date" },
              ]}
            />
          </Col>
          <Col style={{ marginLeft: "auto" }}>
            <Tooltip title="Add Patient">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleRedirect}
              />
            </Tooltip>
          </Col>
        </Row>
        <TableComponent columns={columns} data={data || []}/>
      </Space>
    </Flex>
  );
}
