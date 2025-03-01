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
} from "antd";

import {
  PhoneOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { TableComponent } from "../../components/table/TableComponent";
import { CalendarComponent as Calendar } from "../../components/calendar/CalendarComponent";
import moment from "moment";
import { createAppointment, getAppointmentsList } from "../../apiService";
import { Message } from "../../components/message/Message";

export function AppointmentForm({ setfetchdata }) {
  // Receive function as prop
  const [form] = Form.useForm(); // Create form instance

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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
      const response = await createAppointment(formattedValues);
      if (response.status === 200) {
        Message("success", response.message, 2);
        setfetchdata(true);
        form.resetFields();
      }
    } catch (error) {
      console.error("Failed to create appointment:", error);
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
  const [appointments, setAppointments] = useState([]);
  const [data, setData] = useState([]);
  const [fetchdata, setfetchdata] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  console.log("data: ", data);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (fetchdata) {
      getData();
      setfetchdata(false);
    }
  }, [fetchdata]);

  const getData = async () => {
    getAppointmentsList()
      .then((response) => setData(response.appointments))
      .catch((error) => console.error("Error:", error));
  };

  const showDrawer = (record) => {
    setSelectedAppointment(record);
    setDrawerVisible(true);
  };

  const closeDrawer = () => setDrawerVisible(false);

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
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => showDrawer(record)}
        />
      ),
    },
  ];

  return (
    <Flex vertical>
      <Typography>
        <Divider orientation="left">
          <Title level={2}>Add Appointments</Title>
        </Divider>
      </Typography>
      <AppointmentForm setfetchdata={setfetchdata} />
      <Divider style={{ borderColor: "#000" }} />
      <Typography>
        <Divider orientation="left">
          <Title level={2}>Appointments</Title>
        </Divider>
      </Typography>
      <TableComponent columns={columns} data={data} />
      {/* Drawer Component */}
      <Drawer
        title="Update Appointments"
        width={1100}
        open={drawerVisible}
        onClose={closeDrawer}
      >
        {selectedAppointment && (
          <div>
            <p>
              <strong>Patient Name:</strong> {selectedAppointment.patientName}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                selectedAppointment.appointmentDate
              ).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {selectedAppointment.appointmentTime}
            </p>
            <p>
              <strong>Age:</strong> {selectedAppointment.patientAge}
            </p>
            <p>
              <strong>Contact Number:</strong>{" "}
              {selectedAppointment.contactNumber}
            </p>
          </div>
        )}
      </Drawer>
    </Flex>
  );
}
