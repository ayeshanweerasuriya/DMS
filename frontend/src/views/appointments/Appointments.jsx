import { useState, useEffect } from "react";
import {
  Flex,
  Divider,
  Typography,
  Input,
  Row,
  Col,
  Button,
  Modal,
  Drawer,
  Menu,
  Dropdown,
  DatePicker
} from "antd";

import {
  EditOutlined,
  ReloadOutlined,
  CheckOutlined,
  EllipsisOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { TableComponent } from "../../components/table/TableComponent";
import { getAppointmentsList, deleteAppointment } from "../../apiService";
import { Message } from "../../components/message/Message";
import VerticalSpace from "../../components/vertical-space";
import { AppointmentForm } from "./AppointmentForm";
import { ApproveAppointmentForm } from "./ApproveAppointmentForm";
import moment from "moment";

const { Search } = Input;

export function Appointments() {
  const { Title } = Typography;
  const [data, setData] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refetchData, setRefetchData] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isApproveVisible, setIsApproveVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  console.log("selectedDate: ", selectedDate);

  useEffect(() => {
    getAppointmentsList(searchQuery, selectedDate)
      .then((response) => {
        setData(response.appointments);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
    setRefetchData(false);
  }, [searchQuery, refetchData, selectedDate]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
  };

  const onEdit = (record) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  const onApprove = (record) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
    setIsApproveVisible(true);
  };

  const onDelete = async () => {
    try {
      const response = await deleteAppointment(selectedRecord._id);
      if (response.status === 200) {
        Message("success", response.message, 2);
        setRefetchData(true);
      }
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
    setIsModalVisible(false);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedRecord(null);
    setIsApproveVisible(false);
  };

  const showDeleteModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModelCancel = () => {
    setSelectedRecord(null);
    setIsModalVisible(false);
  };

  const handleDateChange = (date) => {
    // Check if date is valid and format it
    const formattedDate = date ? date.format("M/D/YYYY") : null;
    setSelectedDate(formattedDate); // Store as formatted string
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
    },
    {
      title: "Date",
      dataIndex: "appointmentDate",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate),
    },    
    {
      title: "Time",
      dataIndex: "appointmentTime",
      sorter: (a, b) => a.appointmentTime.localeCompare(b.appointmentTime),
    },
    {
      title: "Age",
      dataIndex: "patientAge",
      sorter: (a, b) => a.patientAge - b.patientAge,
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
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
      render: (_, record) => {
        // Define the menu items
        const menu = (
          <Menu>
            <Menu.Item
              key="edit"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)} // Edit action
            >
              Edit
            </Menu.Item>
            <Menu.Item
              key="approve"
              icon={<CheckOutlined style={{ color: "green" }} />}
              onClick={() => onApprove(record)}
            >
              Approve
            </Menu.Item>
            <Menu.Item
              key="delete"
              icon={<DeleteFilled style={{ color: "red" }} />}
              onClick={() => showDeleteModal(record)}
            >
              Delete
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              type="link"
              icon={<EllipsisOutlined />} // Kebab menu icon
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Flex vertical>
      <Typography>
        <Divider orientation="left">
          <Title level={2}>Add Appointments</Title>
        </Divider>
      </Typography>
      <AppointmentForm setRefetchData={setRefetchData} />
      <Divider style={{ borderColor: "#000" }} />
      <Typography>
        <Divider orientation="left">
          <Title level={2}>Appointments</Title>
        </Divider>
      </Typography>
      <Row gutter={24}>
        <Col span={12}>
          <Search
            placeholder="Search by name or contact number"
            onChange={handleSearch}
          />
        </Col>
        <Col span={4}>
        <DatePicker
            size="medium"
            style={{ width: "100%" }}
            value={selectedDate ? moment(selectedDate, "M/D/YYYY") : null} // Convert to moment object
            onChange={handleDateChange}
            placeholder="Select Appointment Date"
            format="M/D/YYYY"
          />
        </Col>
        <Col span={8}>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => setRefetchData(true)}
            type="primary"
          >
            Refetch Data
          </Button>
        </Col>
      </Row>
      <VerticalSpace height={"20px"} />
      <TableComponent columns={columns} data={data} />
      <Modal
        title="Confirm Deletion"
        open={isModalVisible}
        onOk={onDelete}
        onCancel={handleModelCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        {selectedRecord && (
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedRecord.patientName}</strong>?
          </p>
        )}
      </Modal>
      {/* Drawer Component */}
      <Drawer
        title={isApproveVisible ? "Approve Appointment" : "Update Appointments"}
        width={1100}
        open={drawerVisible}
        onClose={closeDrawer}
      >
        {selectedRecord &&
          (isApproveVisible ? (
            <ApproveAppointmentForm
              selectedRecord={selectedRecord}
              closeDrawer={closeDrawer}
              setRefetchData={setRefetchData}
            />
          ) : (
            <AppointmentForm
              setRefetchData={setRefetchData}
              selectedRecord={selectedRecord}
              closeDrawer={closeDrawer}
              onDelete={onDelete}
            />
          ))}
      </Drawer>
    </Flex>
  );
}
