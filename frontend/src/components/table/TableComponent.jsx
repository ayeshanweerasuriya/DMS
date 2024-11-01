import { Table } from "antd";
import PropTypes from "prop-types";

export function TableComponent({ columns = [], data = [] }) {
  return <Table columns={columns} dataSource={data} />;
}

TableComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};
