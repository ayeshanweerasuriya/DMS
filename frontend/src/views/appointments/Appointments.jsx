import { useState, useEffect } from "react";
import {
  Flex,
  Divider,
  Typography,
  Input,
  Form,
  DatePicker,
  TimePicker,
  InputNumber,
  Row,
  Col,
  Button,
  Space,
  Drawer,
  message,
  Menu,
  Dropdown
} from "antd";

import {
  PhoneOutlined,
  CalendarOutlined,
  EditOutlined,
  ReloadOutlined,
  CheckOutlined,
  EllipsisOutlined,
  DeleteFilled
} from "@ant-design/icons";
import { TableComponent } from "../../components/table/TableComponent";
import { CalendarComponent as Calendar } from "../../components/calendar/CalendarComponent";
import moment from "moment";
import { createAppointment, getAppointmentsList, deleteAppointment, updateAppointment } from "../../apiService";
import { Message } from "../../components/message/Message";
import VerticalSpace from "../../components/vertical-space";

const { Search } = Input;

export function AppointmentForm({ setRefetchData, selectedRecord = null, closeDrawer }) {
  const [form] = Form.useForm();
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

    // Pre-fill the form if editing
    useEffect(() => {
      if (selectedRecord) {
        const appointmentDate = moment(selectedRecord.appointmentDate);
        form.setFieldsValue({
          patientName: selectedRecord.patientName,
          appointmentDate: !appointmentDate.isBefore(moment(), 'day') ? moment(selectedRecord.appointmentDate) : null,
          appointmentTime: !appointmentDate.isBefore(moment(), 'day') ? moment(selectedRecord.appointmentTime, "HH:mm") : null,
          patientAge: selectedRecord.patientAge,
          contactNumber: selectedRecord.contactNumber,
        });
        setSelectedDate(moment(selectedRecord.appointmentDate));
      }
    }, [selectedRecord, form]);

  const handleCalendarButtonClick = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day"); // Disable past dates
  };

  const disabledTime = () => {
    if (!selectedDate) return {}; // If no date selected, allow all times

    if (selectedDate.isSame(moment(), "day")) {
      // If today, disable past hours and minutes
      const currentHour = moment().hour();
      const currentMinute = moment().minute();

      return {
        disabledHours: () => Array.from({ length: currentHour }, (_, i) => i), // Disable past hours
        disabledMinutes: (selectedHour) =>
          selectedHour === currentHour
            ? Array.from({ length: currentMinute }, (_, i) => i) // Disable past minutes if same hour
            : [],
      };
    }

    return {}; // For future dates, allow all times
  };

  const onFinish = async (values) => {
    // console.log("Original values: ", values);

    // Format date to "YYYY-MM-DD"
    const formattedDate = new Date(values.appointmentDate)
      .toISOString()
      .split("T")[0];

    // Format time to "HH:MM AM/PM"
    const timeObj = new Date(values.appointmentTime);
    const formattedTime = timeObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Update values before passing to createAppointment
    const formattedValues = {
      ...values,
      appointmentDate: formattedDate,
      appointmentTime: formattedTime,
    };

    try {
      let response;
      if (selectedRecord) {
        console.log("formattedValues: ", formattedValues);
        console.log("selectedRecord._id: ", selectedRecord._id);
        // If selectedRecord exists, call the updateAppointment function
        response = await updateAppointment(selectedRecord._id, formattedValues);
      } else {
        // If no selectedRecord, create a new appointment
        response = await createAppointment(formattedValues);
      }
      console.log('response.status: ', response.status);
      if (response.status === 200) {
        Message("success", response.message, 2);
        form.resetFields();
        setRefetchData(true);
        closeDrawer();
      }
    } catch (error) {
      console.error("Failed to save appointment:", error);
    }
  };

  return (
    <Form
      form={form} // Attach form instance
      onFinish={onFinish}
      name="layout-multiple-horizontal"
      layout="vertical"
      labelCol={{ span: 6 }} // Increase this value
      wrapperCol={{ span: 18 }} // Adjust accordingly
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Patient Name"
            name="patientName"
            rules={[{ required: true, message: "Patient name is required" }]}
          >
            <Input
              size="large"
              placeholder="Patient Name"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Date"
            name="appointmentDate"
            rules={[{ required: true, message: "Date is required" }]}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              disabledDate={disabledDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Time"
            name="appointmentTime"
            rules={[
              { required: true, message: "Time is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue("appointmentDate")) {
                    return Promise.reject(
                      new Error("Please select a date first!")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <TimePicker
              size="large"
              style={{ width: "100%" }}
              format="HH:mm"
              use12Hours={false}
              disabledTime={disabledTime} // Use the new function here
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Patient Age"
            name="patientAge"
            rules={[{ required: true, message: "Age is required" }]}
          >
            <InputNumber
              size="large"
              min={1}
              max={100}
              parser={(value) => value.replace(/\D/g, "")} // Strips non-numeric input
              onKeyPress={(e) => {
                if (!/^\d+$/.test(e.key)) {
                  e.preventDefault(); // Prevents non-numeric key press
                }
              }}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Contact Number"
            name="contactNumber"
            rules={[
              { required: true, message: "Contact number is required" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Contact number must be exactly 10 digits",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="0701231231"
              prefix={<PhoneOutlined />}
              style={{ width: "100%" }}
              maxLength={10} // Prevents entering more than 10 characters
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="ㅤ" rules={[{ required: true }]}>
            <Space size={"large"}>
              <Button
                style={{ backgroundColor: "#16BE12", color: "#fff" }}
                size="large"
                type="primary"
                htmlType="submit"
              >
                Add Appointment
              </Button>

              <Button
                style={{ backgroundColor: "#000", color: "#fff" }}
                size="large"
                type="primary"
                onClick={() => form.resetFields()}
              >
                Clear
              </Button>

              <Button
                size="large"
                type="primary"
                icon={<CalendarOutlined />}
                onClick={handleCalendarButtonClick}
              />
            </Space>
          </Form.Item>
        </Col>
      </Row>
      {isCalendarVisible && (
        <div style={{ marginTop: "20px" }}>
          <Calendar />
        </div>
      )}
    </Form>
  );
}

export function Appointments() {
  const { Title } = Typography;
  const [data, setData] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refetchData, setRefetchData] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isApproveVisible, setIsApproveVisible] = useState(false);

  useEffect(() => {
    getAppointmentsList(searchQuery)
      .then((response) => {
        console.log("response: ", response);
        setData(response.appointments);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
      setRefetchData(false);
  }, [searchQuery, refetchData]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
  };
  
  const onEdit = (record) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  const onApprove = (record) => {
    console.log("Approving record:", record);
    setSelectedRecord(record);
    setDrawerVisible(true);
    setIsApproveVisible(true);
  };

  const onDelete = async (id) => {
    try {
      const response = await deleteAppointment(id);
      if (response.status === 200) {
        Message("success", response.message, 2);  
        setRefetchData(true);
      }
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedRecord(null);
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
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Time",
      dataIndex: "appointmentTime",
    },
    {
      title: "Age",
      dataIndex: "patientAge",
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
              onClick={() => onDelete(record._id)}
            >
              Delete
            </Menu.Item>
          </Menu>
        );
    
        return (
          <Dropdown overlay={menu} trigger={['click']}>
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
      <Row gutter={16}>
        <Col span={12}>
          <Search
            placeholder="Search by name or contact number"
            onChange={handleSearch}
          />
        </Col>
        <Col span={12}>
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
      {/* Drawer Component */}
      <Drawer
        title="Update Appointments"
        width={1100}
        open={drawerVisible}
        onClose={closeDrawer}
      >
        {selectedRecord && (
          <>
            <AppointmentForm
              setRefetchData={setRefetchData}
              selectedRecord={selectedRecord}
              closeDrawer={closeDrawer}
            />
          </>
        )}
      </Drawer>
    </Flex>
  );
}
