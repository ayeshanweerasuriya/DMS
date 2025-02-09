import { Divider, Typography, Flex, Row, Col, Space, Button } from "antd";
import { Input, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DropdownMenu } from "../../components/dropdown/DropdownMenu";
import { TableComponent } from "../../components/table/TableComponent";
import { useNavigate } from "react-router-dom";
import { columns, data } from "../../testing/table-data";

export function ViewRecords() {
  const navigate = useNavigate();
  const { Title } = Typography;
  const { Search } = Input;

  const handleRedirect = () => {
    navigate("/add-patients");
  };

  return (
    <Flex vertical>
      <Typography>
        <Title level={2}>Patient Records</Title>
        <Divider />
      </Typography>
      <Space direction="vertical" size="large">
        <Row gutter={24}>
          <Col span={8}>
            <Search
              placeholder="input search text"
              // onSearch={}
              enterButton
            />
          </Col>
          <Col gutter={6}>
            <DropdownMenu
              label="Filter By"
              items={[
                { key: "1", label: "Name" },
                { key: "2", label: "Age" },
                { key: "3", label: "Date" },
              ]}
            />
          </Col>
          <Col style={{ marginLeft: "auto" }}>
            <Tooltip title="Add Patient">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleRedirect}
              />
            </Tooltip>
          </Col>
        </Row>
        <TableComponent columns={columns} data={data} />
      </Space>
    </Flex>
  );
}
