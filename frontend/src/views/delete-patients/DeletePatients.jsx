import { useEffect, useState } from "react";
import { Divider, Typography, Space, Row, Col, Input, Flex, Modal } from "antd";
import { TableComponent } from "../../components/table/TableComponent";
import { DeleteFilled } from "@ant-design/icons";
import { Message } from "../../components/message/Message";
import { getPatientList, deletePatient } from "../../apiService";
import { DropdownMenu } from "../../components/dropdown/DropdownMenu";
import { illnessOptions } from "../constants/options";

const { Title } = Typography;
const { Search } = Input;

export function DeletePatients() {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPatientList(searchQuery, filter)
      .then((response) => {
        console.log("response: ", response);
        setData(response.patients);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
    setLoading(false);
  }, [searchQuery, filter]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
  };

  const showDeleteModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    if (selectedPatient) {
      deletePatient(selectedPatient._id)
        .then((response) => {
          console.log("response: ", response);
          setData(data.filter((patient) => patient._id !== selectedPatient._id));
          Message("success", response.message, 2);
        })
        .catch((error) => {
          console.error("error: ", error);
        });
      // TODO: Call delete API function here
    }
    setIsModalVisible(false);
    setSelectedPatient(null);
    setLoading(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
      title: "",
      key: "action",
      render: (_, record) => (
        <Flex align="center" justify="center">
          <DeleteFilled
            style={{ color: "red" }}
            onClick={() => showDeleteModal(record)}
          />
        </Flex>
      ),
    },
  ];

  return (
    <Flex vertical>
      <Typography>
        <Title level={2}>Delete Patients</Title>
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
              items={illnessOptions}
            />
          </Col>
        </Row>
        <TableComponent columns={columns} data={data} loading={loading}/>
      </Space>
      <Modal
        title="Confirm Deletion"
        open={isModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        {selectedPatient && (
          <p>Are you sure you want to delete <strong>{selectedPatient.name}</strong>?</p>
        )}
      </Modal>
    </Flex>
  );
}

export default DeletePatients;
