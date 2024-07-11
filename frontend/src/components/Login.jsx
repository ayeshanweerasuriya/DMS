import { DoctorLogin } from "./DoctorLogin";
import { StaffLogin } from "./StaffLogin";

const Login = () => {
  return (
    <div>
      <StaffLogin />
      <br />
      <DoctorLogin />
    </div>
  );
};

export default Login;
