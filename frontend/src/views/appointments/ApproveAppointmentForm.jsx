import { useState, useEffect } from "react";
import {
  Input,
  Form,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Button,
  Space,
  Select,
} from "antd";

import { PhoneOutlined } from "@ant-design/icons";
import moment from "moment";
import { deleteAppointment, createPatient } from "../../apiService";
import { Message } from "../../components/message/Message";
import { useNavigate } from "react-router-dom";
import { illnessOptions } from "../constants/options";

const { Option } = Select;

export function ApproveAppointmentForm({
  selectedRecord,
  closeDrawer,
  onDelete,
  setRefetchData,
  setLoading,
}) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showOtherField, setShowOtherField] = useState(false);

  // Set initial values when selectedRecord changes
  useEffect(() => {
    if (selectedRecord) {
      form.setFieldsValue({
        name: selectedRecord.patientName || "",
        age: selectedRecord.patientAge || null,
        illnessType: "",
        otherIllness: "",
        contactNumber: selectedRecord.contactNumber || "",
        dateOfBirth: null,
        notes: "",
      });
    }
  }, [selectedRecord, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("YYYY-MM-DD")
          : null,
      };
      const response = await createPatient(formattedValues);
      console.log("response: ", response);
      if (response.status === 201) {
        Message("success", "Appointment approved successfully", 2);
        closeDrawer();
      } else {
        Message("error", response.message, 5);
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
      Message("error", "Failed to approve appointment", 3);
    }
    try {
      const response = await deleteAppointment(selectedRecord._id);
      if (response.status === 200) {
        // Message("success", response.message, 2);
        setRefetchData(true);
        closeDrawer();
      }
    } catch (error) {
      console.error("Failed to remove the appointment from the list: ", error);
      Message("error", "Failed to remove the appointment from the list", 3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="update-patient-form"
      layout="vertical"
      onFinish={onFinish}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Patient Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input size="large" />
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
              parser={(value) => value.replace(/\D/g, "")} // Strips non-numeric input
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
            rules={[
              { required: true, message: "Please select an illness type" },
            ]}
          >
            <Select
              size="large"
              placeholder="Select an illness type"
              style={{ width: "100%" }}
              onChange={(value) => setShowOtherField(value === "Other")}
            >
              {illnessOptions.map((item) => (
                <Select.Option key={item.key} value={item.label}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {showOtherField && (
            <Form.Item
              label="Specify Illness"
              name="otherIllness"
              rules={[{ required: true, message: "Please specify the illness" }]}
            >
              <Input size="large" placeholder="Enter illness name" />
            </Form.Item>
          )}

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
              prefix={<PhoneOutlined />}
              maxLength={10}
              placeholder="0701231231"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            rules={[{ required: true }]}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current >= moment().endOf("day")
              }
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Patient Notes" name="notes">
            <Input.TextArea rows={7} placeholder="Add Patient's Notes Here.." />
          </Form.Item>

          <Form.Item>
            <Space size="large">
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#16BE12", color: "#fff" }}
              >
                Approve
              </Button>
              <Button type="default" onClick={() => form.resetFields()}>
                Clear
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: "#1890ff", color: "#fff" }}
                onClick={() => navigate("/view-records")}
              >
                Patient Records
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
