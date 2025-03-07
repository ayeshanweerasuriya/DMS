import { message } from "antd";

export function Message(type = "success", content = "", duration = 3, style={}) {
  // Call the respective message type method dynamically
  message[type]({
    content: content,
    duration: duration,
    style
  });
}
