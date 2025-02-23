import { useState, useEffect } from "react";
import {
  Divider,
  Typography,
  Flex,
  Row,
  Col,
  Space,
  Button,
  Drawer,
} from "antd";
import { Input, Tooltip } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { TableComponent } from "../../components/table/TableComponent";
import { useNavigate } from "react-router-dom";
import { getPatientList } from "../../apiService";

const { Title } = Typography;
const { Search } = Input;

export function ViewRecords() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    getPatientList(searchQuery)
      .then((response) => {
        console.log("response: ", response);
        setData(response.patients);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  }, [searchQuery]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
  };

  const handleRedirect = () => {
    navigate("/add-patients");
  };

  const handleView = (record) => {
    console.log("Viewing record:", record);
    setSelectedPatient(record);
    setIsDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
    setSelectedPatient(null);
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
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        />
      ),
    },
  ];

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
              placeholder="Search by name or contact number"
              onChange={handleSearch}
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
        <TableComponent columns={columns} data={data || []} />
      </Space>
      <Drawer
        title="Patient Details"
        placement="right"
        width={400}
        onClose={handleCloseDrawer}
        open={isDrawerVisible}
      >
        {selectedPatient && (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Input addonBefore="Name" value={selectedPatient.name} readOnly />
            <Input addonBefore="Age" value={selectedPatient.age} readOnly />
            <Input
              addonBefore="Illness"
              value={selectedPatient.illnessType}
              readOnly
            />
            <Input
              addonBefore="Contact"
              value={selectedPatient.contactNumber}
              readOnly
            />
            <Input
              addonBefore="DOB"
              value={new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
              readOnly
            />
            <Input.TextArea
              addonBefore="Notes"
              value={selectedPatient.notes}
              autoSize={{ minRows: 3 }}
              readOnly
            />
            <Input
              addonBefore="Medication Fee"
              value={`$${selectedPatient.medicationFee}`}
              readOnly
            />
            <Input
              addonBefore="Treatment Fee"
              value={`$${selectedPatient.treatmentFee}`}
              readOnly
            />
            <Input
              addonBefore="Created At"
              value={new Date(selectedPatient.createdAt).toLocaleString()}
              readOnly
            />
          </Space>
        )}
      </Drawer>
    </Flex>
  );
}
