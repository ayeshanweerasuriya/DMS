import { useState } from "react";
import { Input, Form, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const PhoneNumberInput = ({
  label,
  value,
  onChange = () => {},
  required = false,
  tooltipText,
}) => {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Allow only numbers and ensure length is exactly 10
    if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
      onChange(inputValue);
      setError("");
    } else {
      setError("Invalid phone number");
    }
  };

  return (
    <Form.Item
      label={
        <span>
          {label} {required && <span style={{ color: "red" }}>*</span>}
          {tooltipText && (
            <Tooltip title={tooltipText}>
              <InfoCircleOutlined style={{ marginLeft: 5 }} />
            </Tooltip>
          )}
        </span>
      }
      validateStatus={error ? "error" : ""}
      help={error}
      required={required}
    >
      <Input
        value={value}
        onChange={handleChange}
        placeholder="e.g. 0712345678"
        maxLength={10}
      />
    </Form.Item>
  );
};

PhoneNumberInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  tooltipText: PropTypes.string,
};

export default PhoneNumberInput;
