import PropTypes from "prop-types";

export default function Button({
  text,
  color = null,
  width = "200px",
  shadow = true,
}) {
  const buttonStyle = {
    width: width,
    height: "40px",
    margin: "10px 0px",
    borderRadius: "50px",
    backgroundColor: color === null ? "#3687FF" : color,
    color: "#fff",
    fontSize: "18px",
    fontWeight: "500",
    cursor: "pointer",
    border: "none",
    boxShadow: shadow ? "0 4px 15px rgba(0, 0, 0, 0.2)" : "none",
  };

  return (
    <button style={buttonStyle} className="custom-button">
      {text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  width: PropTypes.string,
  shadow: PropTypes.bool,
};
