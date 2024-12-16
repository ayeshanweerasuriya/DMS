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
import { PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import { Message } from "../../components/message/Message";
import { useNavigate } from "react-router-dom";
export function AddPatients() {
  const { Title } = Typography;
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/view-records");
  }
  
  return (
   // <AddPatientsForm handleRedirect={handleRedirect}/> 
   <Flex vertical>
      <Typography>
        <Divider orientation="left">
          <Title level={2}>Add Patients</Title>
        </Divider>
      </Typography>
      <AddPatientsForm handleRedirect={handleRedirect}/>
    </Flex>
  );
}
export function AddPatientsForm(props){
  return(
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
              style={{ width: "100%" }}
            />
          </Form.Item>
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
          <Form.Item
            label="Illness Type"
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
          <Form.Item label="Date of Birth" name="date" rules={[{ required: true }]}>
            <DatePicker size="large" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item
        label="Patient Notes"
        name="PatientNote"
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
                onClick={() =>
                  Message("success", "Patient Saved successfully")
                }
              >
                Save
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
                style={{ backgroundColor: "#1890ff", color: "#fff" }}
                size="large"
                type="primary"
                onClick={props.handleRedirect}
               >
                Patient Records
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}