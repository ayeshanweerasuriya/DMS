import { useState, useEffect } from "react";
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
  Drawer,
  Select,
  Radio,
  Tag
} from "antd";
import { PhoneOutlined, PlusOutlined } from "@ant-design/icons";
import { Message } from "../../components/message/Message";
// import { useNavigate } from "react-router-dom";
import { getPatientList } from "../../apiService";
import { TableComponent } from "../../components/table/TableComponent";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import moment from "moment";
import { updatePatient } from "../../apiService";
import { useNavigate } from "react-router-dom";
import { DropdownMenu } from "../../components/dropdown/DropdownMenu";
import VerticalSpace from "../../components/vertical-space";
import { illnessOptions, severityOptions, severityColors } from "../constants/options";

const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

export function UpdatePatients() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [record, setRecord] = useState({});
  const [refetch, setRefetch]=useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("0");

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

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
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
      title: "Illness Type",
      dataIndex: "illnessType",
      sorter: (a, b) => a.illnessType.localeCompare(b.illnessType),
    },
    {
      title: "Severity Level",
      dataIndex: "severityLevel",
      sorter: (a, b) => a.severityLevel.localeCompare(b.severityLevel),
      render: (severity) => (
        <Tag color={severityColors[severity] || "#108ee9"}>{severity}</Tag>
      )
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Update Patient",
      dataIndex: "actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => showDrawer(record)}
        />
      ),
    }
  ];

  const showDrawer = (record) => {
    setRecord(record);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  
  return (
    <Flex vertical>
      <Typography>
        <Divider orientation="left">
          <Title level={2}>Update Patients</Title>
        </Divider>
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
        <VerticalSpace height={"20px"} />
        <TableComponent columns={columns} data={data || []} />
        {/* <Button onClick={showDrawer}></Button> */}
      </Typography>
      <Drawer
        key={record?._id}
        title="Update Patient"
        width={1100}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            {/* <Button onClick={onClose} type="primary">
              Update
            </Button> */}
          </Space>
        }
        >
      <UpdatePatientsForm data={record || {}} setRefetch={setRefetch} onClose={onClose}/>
      </Drawer>
    </Flex>
  );
}

export function UpdatePatientsForm({ data,setRefetch,onClose }){
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
console.log("sample data: ",data);
useEffect(() => {
  if (data) {
    form.setFieldsValue({
      name: data.name || "",
      age: data.age || null,
      illnessType: data.illnessType || "",
      contactNumber: data.contactNumber || "",
      dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : null,
      severityLevel: data.severityLevel || "Mild",
      notes: data.notes || "",
      treatmentFee: data.treatmentFee || "",
      medicationFee: data.medicationFee || "",
      hospitalFee: data.hospitalFee || "",
    });
  }
}, [data, form]);

    // Set initial values
    const initialValues = {
      name: data.name || "",
      age: data.age || null,
      illnessType: data.illnessType || "",
      contactNumber: data.contactNumber || "",
      dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : null,
      severityLevel: data.severityLevel || "Mild",
      notes: data.notes || "",
      treatmentFee: data.treatmentFee || "",
      medicationFee: data.medicationFee || "",
      hospitalFee: data.hospitalFee || "",
    };
  
    const onFinish = async (values) => {
    try {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("YYYY-MM-DD")
          : null, // Ensure the correct key
      };
      const response = await updatePatient(data._id, formattedValues);
      console.log("response: ", response);
      if (response.status === 200) {
        setRefetch(true)
        Message("success", response.message, 2)
        onClose()
      } else {
        Message("error", response.message, 5);
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      Message("error", "Failed to save patient", 3);
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
              initialvalues={3}
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
            rules={[{ required: true, message: "Please select an illness type" }]}
          >
            <Select size="large" placeholder="Select an illness type" style={{ width: "100%" }}>
              {illnessOptions.map((item) => (
                <Option key={item.key} value={item.label}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

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

          <Form.Item
            label="Severity Level"
            name="severityLevel"
            rules={[{ required: true, message: "Please select a severity level" }]}
            >
            <Radio.Group
              block
              options={severityOptions}
              defaultValue="Mild"
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>

          <Form.Item label="Treatment Fee" name="treatmentFee">
            <Input size="large" />
          </Form.Item>

          <Form.Item label="Medication Fee" name="medicationFee">
            <Input size="large" />
          </Form.Item>

          <Form.Item label="Hospital Fee" name="hospitalFee">
            <Input size="large" readOnly />
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
                Update
              </Button>
              <Button type="default" onClick={() => form.resetFields()}>
                Clear
              </Button>
              <Button type="primary" style={{ backgroundColor: "#1890ff", color: "#fff" }} onClick={() => navigate("/view-records")}>
                Patient Records
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
