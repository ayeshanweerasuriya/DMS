import React, { useState, useEffect } from "react";
import { Alert, Button, Space } from "antd";

export function NotificationAlert ({
  message,
  description,
  type = "info",
  buttonText,
  onButtonClick,
  duration = 3,
  persistent = false,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!persistent) {
      const timer = setTimeout(() => setVisible(false), duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [duration, persistent]);

  if (!visible) return null;

  return (
    <Alert
      message={message}
      description={description}
      type={type}
      showIcon
      action={
        buttonText && onButtonClick ? (
          <Button size="small" type="primary" onClick={onButtonClick}>
            {buttonText}
          </Button>
        ) : null
      }
      closable={!persistent}
      onClose={() => setVisible(false)}
    />
  );
};

