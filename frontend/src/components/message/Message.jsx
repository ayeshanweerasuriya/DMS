import { message } from "antd";

export function Message(type = "success", content = "") {
  message.open({
    type: type,
    content: content,
  });
}
