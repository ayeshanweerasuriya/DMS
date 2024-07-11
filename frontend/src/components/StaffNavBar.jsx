import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function StaffNavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <Link to={"/staff-appointments"}>
        <button>Appointments</button>
      </Link>
      <Link to={"/staff-viewrecords"}>
        <button>View Records</button>
      </Link>
      <Link to={"/staff-addpatients"}>
        <button>Add Patients</button>
      </Link>
      <Link to={"/staff-updatepatients"}>
        <button>Update Patients</button>
      </Link>
      <Link to={"/staff-deletepatients"}>
        <button>Delete Patients</button>
      </Link>
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        logout
      </button>
    </div>
  );
}
