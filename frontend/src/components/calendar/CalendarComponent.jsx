import { Calendar } from "antd";
import PropTypes from "prop-types";

export function CalendarComponent({ onPanelChange, ...props }) {
  const handlePanelChange = (value, mode) => {
    if (onPanelChange) {
      onPanelChange(value, mode);
    } else {
      console.log(value.format("YYYY-MM-DD"), mode);
    }
  };

  return <Calendar onPanelChange={handlePanelChange} {...props} />;
}

CalendarComponent.propTypes = {
  onPanelChange: PropTypes.func,
};
