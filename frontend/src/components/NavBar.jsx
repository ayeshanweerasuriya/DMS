import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to={"/appointments"}>
        <button>Appointments</button>
      </Link>
      <Link to={"/viewrecords"}>
        <button>View Records</button>
      </Link>
      <Link to={"/addpatients"}>
        <button>Add Patients</button>
      </Link>
      <Link to={"/updatepatients"}>
        <button>Update Patients</button>
      </Link>
      <Link to={"/deletepatients"}>
        <button>Delete Patients</button>
      </Link>
      <button onClick={handleLogOut}>logout</button>
    </div>
  );
}
