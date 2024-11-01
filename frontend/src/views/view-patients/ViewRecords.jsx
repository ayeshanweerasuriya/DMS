import { Divider, Typography, Flex, Row, Col, Space } from "antd";
import { Input } from "antd";
import { DropdownMenu } from "../../components/dropdown/DropdownMenu";
import { TableComponent } from "../../components/table/TableComponent";

export function ViewRecords() {
  const { Title } = Typography;
  const { Search } = Input;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Chinese Score",
      dataIndex: "chinese",
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: "Math Score",
      dataIndex: "math",
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
    },
    {
      title: "English Score",
      dataIndex: "english",
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      chinese: 98,
      math: 60,
      english: 70,
    },
    {
      key: "2",
      name: "Jim Green",
      chinese: 98,
      math: 66,
      english: 89,
    },
    {
      key: "3",
      name: "Joe Black",
      chinese: 98,
      math: 90,
      english: 70,
    },
    {
      key: "4",
      name: "Jim Red",
      chinese: 88,
      math: 99,
      english: 89,
    },
  ];

  return (
    <Flex vertical>
      <Typography>
        <Title level={2}>View Records</Title>
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
              label="Sort By"
              items={[
                { key: "1", label: "Name" },
                { key: "2", label: "Age" },
                { key: "3", label: "Date" },
              ]}
            />
          </Col>
        </Row>
        <TableComponent columns={columns} data={data} />
      </Space>
    </Flex>
  );
}
