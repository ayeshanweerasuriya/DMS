import { Divider, Typography, Flex, Row, Col, Space, Card, InputNumber } from "antd";
import { useState } from "react";
import { TableComponent } from "../../components/table/TableComponent";

export function ViewIncome() {
  const { Title } = Typography;
  const [hospitalCharge, setHospitalCharge] = useState(1200);
  const [dailyIncome] = useState(0);
  const [totalIncome] = useState(0);
  const [incomeData] = useState([]); // Store income data fetched from API

  // Define columns for the table
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Patient Fee', dataIndex: 'fee', key: 'fee' },
  ];

 /* // Fetch data from API on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/income"); // Replace with your actual API endpoint
        const data = await response.json();
        setIncomeData(data); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []); // Empty array ensures this effect runs once when the component mounts*/

  return (
    <Flex vertical style={{  }}>
      <Typography>
        <Title level={2}>View Income</Title>
        <Divider />
      </Typography>
      <Row gutter={24}>
        <Col span={16}>
          <TableComponent columns={columns} data={incomeData} />
        </Col>
        <Col span={8}>
          <Space direction="vertical" size="large" style={{ width: "80%" }}>
            <Card title="Daily Income" bordered={false} style={{textAlign: "center" }}>
              <InputNumber value={dailyIncome} disabled style={{ width: "100%", textAlign: "center" }} />
            </Card>
            <Card title="Total Income" bordered={false} style={{textAlign: "center" }}>
              <InputNumber value={totalIncome} disabled style={{ width: "100%", textAlign: "center" }} />
            </Card>
          </Space>
        </Col>
      </Row>
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={16}>
          <Card bordered={true}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold" }}>Hospital Charge:</span>
              <InputNumber
                min={0}
                value={hospitalCharge}
                onChange={setHospitalCharge}
                style={{ width: "30%", textAlign: "center",backgroundColor: "#f0f0f0"  }}
              />
            </div>
          </Card>
        </Col>
     </Row>
    </Flex>
  );
}


