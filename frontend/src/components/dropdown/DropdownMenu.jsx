import { useState } from "react";
import PropTypes from "prop-types";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Button } from "antd";
import "./DropdownMenu.css"; // Importing CSS for custom styles

export function DropdownMenu({
  items,
  defaultLabel = "Sort by:",
  onItemSelect = () => {},
}) {
  const [selectedLabel, setSelectedLabel] = useState("");

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem && !selectedItem.disabled) {
      const label = selectedItem.label.props
        ? selectedItem.label.props.children
        : selectedItem.label;
      setSelectedLabel(label);

      // Call the onItemSelect callback if provided
      if (onItemSelect) {
        onItemSelect(selectedItem);
      }
    }
  };

  return (
    <Dropdown menu={{ items, onClick: handleMenuClick }}>
      <Button className="dropdown-button">
        <Space>
          <span className="default-label">{defaultLabel}</span>{" "}
          {/* Always displayed label */}
          <span className="selected-label">
            {selectedLabel || "Select an option"}
          </span>{" "}
          {/* Dynamic selected label */}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}

DropdownMenu.propTypes = {
  items: PropTypes.array.isRequired,
  defaultLabel: PropTypes.string,
  onItemSelect: PropTypes.func,
};
