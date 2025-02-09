import { message } from "antd";

export function Message(type = "success", content = "", duration = 3) {
  // Call the respective message type method dynamically
  message[type]({
    content: content,
    duration: duration,
  });
}
