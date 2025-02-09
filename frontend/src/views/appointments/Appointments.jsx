import { useState } from "react";
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
} from "antd";
import { PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import { TableComponent } from "../../components/table/TableComponent";
import { Message } from "../../components/message/Message";
import { CalendarComponent as Calendar } from "../../components/calendar/CalendarComponent";

export function AppointmentForm() {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const handleCalendarButtonClick = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  return (
    <Form
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
            rules={[{ required: true }]}
          >
            <Input
              size="large"
              placeholder="Patient Name"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker size="large" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Time" name="time" rules={[{ required: true }]}>
            <TimePicker size="large" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Patient Age"
            name="age"
            rules={[{ required: true }]}
          >
            <InputNumber
              size="large"
              min={1}
              max={100}
              initialvalues={3}
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
            rules={[{ required: true }]}
          >
            <Input
              size="large"
              placeholder="0701231231"
              prefix={<PhoneOutlined />}
              style={{ width: "100%" }}
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
                onClick={() =>
                  Message("success", "Appointment created successfully")
                }
              >
                Add Appointment
              </Button>
              <Button
                style={{ backgroundColor: "#000", color: "#fff" }}
                size="large"
                type="primary"
                htmlType="submit"
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

  return (
    <Flex vertical>
      <Typography>
        <Divider orientation="left">
          <Title level={2}>Add Appointments</Title>
        </Divider>
      </Typography>
      <AppointmentForm />
      <Divider style={{ borderColor: "#000" }} />
      <Typography>
        <Divider orientation="left">
          <Title level={2}>Appointments</Title>
        </Divider>
      </Typography>
      <TableComponent columns={[]} data={[]} />
    </Flex>
  );
}
