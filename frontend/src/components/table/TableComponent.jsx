import { Table, ConfigProvider } from "antd";
import PropTypes from "prop-types";

export function TableComponent({ columns = [], data = [], i = 0, loading = true }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            borderColor: "#f0f0f0",
            headerBg: "#3687FF",
            headerColor: "#fff",
            bodySortBg: "#f2f7fc",
            headerSortActiveBg: "#2a65bd",
            headerSortHoverBg: "#2a65bd",
            headerSplitColor: "#fff",
            rowHoverBg: "#f2f7fc",
          },
        },
      }}
    >
      <Table columns={columns} dataSource={data} rowKey={(record) => record._id || i++} loading={loading}/>
    </ConfigProvider>
  );
}

TableComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  i: PropTypes.number,
};
