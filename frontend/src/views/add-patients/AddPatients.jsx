import { useState } from "react";
import {
  Flex,
  Divider,
  Typography,
  Input,
  Form,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Button,
  Space,
} from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { Message } from "../../components/message/Message";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../../apiService";
import moment from "moment";
import { NotificationAlert } from "../../components/notification-alert/NotificationAlert";


export function AddPatientsForm({handleRedirect}) {
  const [form] = Form.useForm(); // Form instance
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const onFinish = async (values) => {
    try {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("YYYY-MM-DD")
          : null, // Ensure the correct key
      };
      const response = await createPatient(formattedValues);
      if (response.status === 201) {
        Message("success", response.message, 2);
        form.resetFields();
        setSuccess(true);
      } else {
        Message("error", response.message, 5);
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      Message("error", "Failed to save patient", 3);
    }
  };

  const navigateToUpdateRecords = () => {
      navigate("/update-patients");
  };

  return (
    <Form
      form={form}
      name="add-patient-form"
      onFinish={onFinish}
      layout="vertical"
      labelCol={{ span: 6 }} // Increase this value
      wrapperCol={{ span: 18 }} // Adjust accordingly
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Patient Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input size="large" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Patient Age"
            name="age"
            rules={[{ required: true, message: "Patient age is required" }]}
          >
            <InputNumber
              size="large"
              min={1}
              max={150}
              changeOnWheel
              initialvalues={3}
              parser={(value) => value.replace(/\D/g, "")}  // Strips non-numeric input
              onKeyPress={(e) => {
                if (!/^\d+$/.test(e.key)) {
                  e.preventDefault(); // Prevents non-numeric key press
                }
              }}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Illness Type"
            name="illnessType"
            rules={[{ required: true }]}
          >
            <Input size="large" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Contact Number"
            name="contactNumber"
            rules={[
              { required: true, message: "Contact number is required" },
              { pattern: /^[0-9]{10}$/, message: "Contact number must be exactly 10 digits" },
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
          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            rules={[{ required: true, message: "Date of Birth is required" }]}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              disabledDate={(current) => current && current >= moment().endOf("day")}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Patient Notes"
            name="notes"
            rules={[{ required: false }]}
          >
            <Input.TextArea
              rows={7} // Specify the number of rows you want
              size="large"
              placeholder="Add Patient's Notes Here.."
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="ㅤ" rules={[{ required: true }]}>
            <Space size={"large"}>
              <Button
                style={{ backgroundColor: "#16BE12", color: "#fff" }}
                size="large"
                type="primary"
                htmlType="submit"
              >
                Save
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
                style={{ backgroundColor: "#1890ff", color: "#fff" }}
                size="large"
                type="primary"
                onClick={handleRedirect}
              >
                Patient Records
              </Button>
            </Space>
          </Form.Item>
          {success && (
            <div style={{ marginTop: "16px" }}>
              <NotificationAlert
                message="To Update Patient Records"
                type="info"
                buttonText="Click Here"
                onButtonClick={navigateToUpdateRecords}
                duration={10}
              />
            </div>
          )}
        </Col>
      </Row>
    </Form>
  );
}

export function AddPatients() {
  const { Title } = Typography;
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/view-records");
  };

  return (
    // <AddPatientsForm handleRedirect={handleRedirect}/>
    <Flex vertical>
      <Typography>
        <Divider orientation="left">
          <Title level={2}>Add Patients</Title>
        </Divider>
      </Typography>
      <AddPatientsForm handleRedirect={handleRedirect} />
    </Flex>
  );
}
