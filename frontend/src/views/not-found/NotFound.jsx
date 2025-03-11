import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Result
      style={{ marginTop: "100px" }}
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => navigate("/view-records")}>
          Back to View Patient Records
        </Button>
      }
    />
  );
};
