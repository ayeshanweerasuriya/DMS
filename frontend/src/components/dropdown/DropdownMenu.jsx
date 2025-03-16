import { useState } from "react";
import PropTypes from "prop-types";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Button } from "antd";
import "./DropdownMenu.css"; // Importing CSS for custom styles

export function DropdownMenu({
  items,
  defaultLabel = "Sort by:",
  onItemSelect = () => {},
  defaultOption = null,
}) {
  const [selectedLabel, setSelectedLabel] = useState(defaultOption || "Select an option");

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem && !selectedItem.disabled) {
      const label = selectedItem.label.props
        ? selectedItem.label.props.children
        : selectedItem.label;
      setSelectedLabel(label); // Update state to reflect selected item

      if (onItemSelect) {
        onItemSelect(selectedItem);
      }
    }
  };

  return (
    <Dropdown className="dropdown" menu={{ items, onClick: handleMenuClick }}>
      <Button className="dropdown-button">
        <Space>
          <span className="default-label">{defaultLabel}</span>{" "}
          <span className="selected-label">{selectedLabel}</span>{" "}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
