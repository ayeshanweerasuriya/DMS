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
import { getIncomeStatistics, updateHospitalFee } from "../../apiService";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';

export function ViewIncome() {
  const { Title } = Typography;
  const [hospitalCharge, setHospitalCharge] = useState(1200);
  const [incomeStatistics, setIncomeStatistics] = useState({});
  const [eachPatientFee, setEachPatientFee] = useState([]);
  const [refetchData, setRefetchData] = useState(false);

  useEffect(() => {
    getIncomeStatistics()
      .then((response) => {
        console.log("response: ", response);
        setIncomeStatistics({
          todayIncome: response.data.todayIncome,
          totalIncome: response.data.totalIncome,
        });
        setEachPatientFee(response.data.eachPatientFee);
        setHospitalCharge(response.data.eachPatientFee[0].hospitalFee);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
      setRefetchData(false);
  }, [refetchData]);

  const handleSave = () => {
    try {
      updateHospitalFee({ "newHospitalFee": hospitalCharge });
      message.success("Hospital Charge saved successfully!");
      console.log("Saved hospital charge:", hospitalCharge);
      setRefetchData(true);
    } catch (error) {
      console.error("error: ", error);
      message.error("Failed to save hospital charge");
    }
  };

  console.log("eachPatientFee: ", eachPatientFee);

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // Sorting alphabetically by name
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(), // Format the date as needed
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), // Sort by date
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <PDFDownloadLink 
          document={<InvoicePDF record={record} />} 
          fileName={`Invoice-${record.name}.pdf`}
        >
          {({ loading }) => (loading ? 'Loading document...' : 'Download Invoice')}
        </PDFDownloadLink>
      ),
    }
  ];

  return (
    <Flex vertical style={{}}>
      <Typography>
        <Title level={2}>View Income</Title>
        <Divider />
      </Typography>
      <Row gutter={24}>
        <Col span={16}>
          <TableComponent columns={columns} data={eachPatientFee} />
        </Col>
        <Col span={8}>
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
              <InputNumber
                value={incomeStatistics.todayIncome || 0}
                readOnly
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "24px",
                  color: "#1677ff",
                }}
                formatter={(value) => `Rs. ${value}`}
              />
            </Card>

            <Card
              title="Total Income (This Month)"
              bordered={false}
              style={{
                textAlign: "center",
                borderRadius: "8px",
              }}
            >
              <InputNumber
                value={incomeStatistics.totalIncome || 0}
                readOnly
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "24px",
                  color: "#1677ff",
                }}
                formatter={(value) => `Rs. ${value}`}
              />
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
