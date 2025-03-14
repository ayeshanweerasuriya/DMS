import { useState, useEffect } from "react";
import {
  Divider,
  Typography,
  Flex,
  Row,
  Col,
  Space,
  Card,
  InputNumber,
  Button,
  message,
} from "antd";
import { TableComponent } from "../../components/table/TableComponent";
import { PDFInvoice } from "../../components/pdf/PDFRenderer";
import {
  getIncomeStatistics,
  updateHospitalFee,
  getHospitalFee,
} from "../../apiService";
import { PDFDownloadLink } from "@react-pdf/renderer";

export function ViewIncome() {
  const { Title } = Typography;
  const [hospitalCharge, setHospitalCharge] = useState(0);
  const [incomeStatistics, setIncomeStatistics] = useState({});
  const [eachPatientFee, setEachPatientFee] = useState([]);
  const [refetchData, setRefetchData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getIncomeStatistics()
      .then((response) => {
        console.log("response: ", response);
        setIncomeStatistics({
          todayIncome: response.data.todayIncome,
          totalIncome: response.data.totalIncome,
        });
        setEachPatientFee(response.data.eachPatientFee);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
    getHospitalFee()
      .then((response) => {
        console.log("response: ", response);
        setHospitalCharge(response.hospitalFee);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
    setRefetchData(false);
    setLoading(false);
  }, [refetchData]);

  const handleSave = async () => {
    try {
      const response = await updateHospitalFee({
        newHospitalFee: hospitalCharge,
      });
      message.success(response.message);
      console.log("response: ", response);
      setRefetchData(true);
    } catch (error) {
      console.error("error: ", error);
      message.error("Failed to save hospital charge");
    }
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // Sorting alphabetically by name
    },
    {
      title: "Treatment Fee",
      dataIndex: "treatmentFee",
      key: "treatmentFee",
      sorter: (a, b) => a.treatmentFee - b.treatmentFee, // Sort by treatment fee (numeric)
    },
    {
      title: "Medication Fee",
      dataIndex: "medicationFee",
      key: "medicationFee",
      sorter: (a, b) => a.medicationFee - b.medicationFee, // Sort by medication fee (numeric)
    },
    {
      title: "Hospital Fee",
      dataIndex: "hospitalFee",
      key: "hospitalFee",
    },
    {
      title: "Total Fee",
      dataIndex: "totalFee",
      key: "totalFee",
      sorter: (a, b) => a.totalFee - b.totalFee, // Sort by total fee (numeric)
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(), // Format the date as needed
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), // Sort by date
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <PDFDownloadLink
          document={<PDFInvoice record={record} />}
          fileName={`Invoice-${record.name}.pdf`}
        >
          <Button type="primary">{"Download Invoice"}</Button>
        </PDFDownloadLink>
      ),
    },
  ];

  return (
    <Flex vertical style={{}}>
      <Typography>
        <Title level={2}>View Income</Title>
        <Divider />
      </Typography>
      <Row gutter={24}>
        <Col span={16}>
          <TableComponent columns={columns} data={eachPatientFee} loading={loading}/>
        </Col>
        <Col span={5}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card
              title="Today Income"
              bordered={false}
              style={{
                textAlign: "center",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              <Title level={3}>{`Rs. ${incomeStatistics.todayIncome || 0}`}</Title>
            </Card>

            <Card
              title="Total Income (This Month)"
              bordered={false}
              style={{
                textAlign: "center",
                borderRadius: "8px",
              }}
            >
              <Title level={3}>{`Rs. ${incomeStatistics.totalIncome || 0}`}</Title>
            </Card>
          </Space>
        </Col>
      </Row>
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={16}>
          <Card bordered={true}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "bold" }}>Hospital Charge:</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <InputNumber
                  min={0}
                  value={hospitalCharge}
                  onChange={setHospitalCharge}
                  style={{
                    width: "300px",
                    textAlign: "center",
                    backgroundColor: "#f0f0f0",
                  }}
                />
                <Button
                  type="primary"
                  onClick={handleSave}
                  style={{ marginLeft: "8px" }}
                >
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Flex>
  );
}
