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
  Descriptions,
  Input,
  Tooltip,
  Skeleton,
} from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { TableComponent } from "../../components/table/TableComponent";
import { useNavigate } from "react-router-dom";
import { getPatientList, getTreatment } from "../../apiService";
import { DropdownMenu } from "../../components/dropdown/DropdownMenu";
import "./index.css";

const { Title, Paragraph } = Typography;
const { Search } = Input;

export function ViewRecords() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [treatment, setTreatment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("0");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPatientList(searchQuery, filter)
      .then((response) => {
        console.log("response: ", response);
        setData(response.patients);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  }, [searchQuery, filter]);

  console.log("selectedPatient: ", selectedPatient);
  console.log("treatment: ", treatment);

  useEffect(() => {
    if (selectedPatient?._id) {
      setIsLoading(true);
      getTreatment(selectedPatient._id)
        .then((response) => {
          setTreatment(response.recommendation);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching treatment:", error);
          setIsLoading(false);
        });
    }
  }, [selectedPatient]);

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
    setTreatment("");
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
          <Col gutter={6}>
            <DropdownMenu
              label="Sort By Illness"
              defaultOption="All"
              onItemSelect={(item) => setFilter(item.key)}
              items={[
                { key: "0", label: "All" },
                { key: "1", label: "Cavities" },
                { key: "2", label: "Gingivitis" },
                { key: "3", label: "Periodontitis" },
                { key: "4", label: "Tooth Decay" },
                { key: "5", label: "Oral Cancer" },
                { key: "6", label: "Bruxism" },
                { key: "7", label: "Impacted Teeth" },
                { key: "8", label: "Tooth Sensitivity" },
                { key: "9", label: "Halitosis" },
                { key: "10", label: "TMJ Disorders" },
                { key: "11", label: "Other" },
              ]}
            />
          </Col>
          <Col gutter={6}></Col>
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
        width={480}
        onClose={handleCloseDrawer}
        open={isDrawerVisible}
      >
        {selectedPatient && (
          <>
            <DetailedView selectedPatient={selectedPatient} />

            <div style={{ marginTop: "20px" }}>
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <TypingEffect text={treatment} />
              )}
            </div>
          </>
        )}
      </Drawer>
      ;
    </Flex>
  );
}

export function DetailedView({ selectedPatient }) {
  return (
    <Descriptions
      column={1}
      bordered
      size="middle"
      labelStyle={{ fontWeight: "bold" }}
      labelBg
    >
      <Descriptions.Item label="Name">
        {selectedPatient.name || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Age">
        {selectedPatient.age || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Illness">
        {selectedPatient.illnessType || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Contact">
        {selectedPatient.contactNumber || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="DOB">
        {selectedPatient.dateOfBirth
          ? new Date(selectedPatient.dateOfBirth).toLocaleDateString()
          : "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Notes">
        <Paragraph
          style={{ marginBottom: 0 }}
          ellipsis={{ rows: 3, expandable: true, symbol: "Read more" }} // Collapsible notes section
        >
          {selectedPatient.notes || "No notes available"}
        </Paragraph>
      </Descriptions.Item>
      <Descriptions.Item label="Medication Fee (Rs.)">
        {selectedPatient.medicationFee
          ? `Rs. ${selectedPatient.medicationFee}`
          : "Rs. 0"}
      </Descriptions.Item>
      <Descriptions.Item label="Treatment Fee (Rs.)">
        {selectedPatient.treatmentFee
          ? `Rs. ${selectedPatient.treatmentFee}`
          : "Rs. 0"}
      </Descriptions.Item>
      <Descriptions.Item label="Hospital Fee (Rs.)">
        {selectedPatient.hospitalFee
          ? `Rs. ${selectedPatient.hospitalFee}`
          : "Rs. 0"}
      </Descriptions.Item>
      <Descriptions.Item label="Created At">
        {selectedPatient.createdAt
          ? new Date(selectedPatient.createdAt).toLocaleString()
          : "N/A"}
      </Descriptions.Item>
    </Descriptions>
  );
}

export function TypingEffect({ text }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);

      return () => clearTimeout(timeout);
    } else {
      const cursorTimeout = setTimeout(() => {
        setShowCursor(false);
      }, 1000);
      return () => clearTimeout(cursorTimeout);
    }
  }, [currentIndex, text]);

  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(0);
    setShowCursor(true);
  }, [text]);

  return (
    <Space direction="vertical" size="large">
      <Divider orientation="left">Treatment Recommendation</Divider>
      <div className="chat-message">
        <div className="chat-avatar">AI</div>
        <div className="chat-bubble">
          {displayText}
          {showCursor && <span className="typing-cursor">|</span>}
        </div>
      </div>
    </Space>
  );
}
