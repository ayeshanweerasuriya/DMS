import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import { StaffDashboard } from "./components/StaffDashboard";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { useAuth } from "./context/AuthContext";
import { StaffAppointments } from "./components/StaffAppointments";
import { StaffViewRecords } from "./components/StaffViewRecords";
import { StaffAddPatients } from "./components/StaffAddPatients";
import { StaffUpdatePatients } from "./components/StaffUpdatePatients";
import { StaffDeletePatients } from "./components/StaffDeletePatients";

const App = () => {
  const { loggedIn, userType } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? <Navigate to={`/${userType}-dashboard`} /> : <Login />
          }
        />
        <Route path="/staff-login" element={<Login />} />
        <Route path="/doctor-login" element={<Login />} />
        <Route
          path="/staff-dashboard"
          element={
            loggedIn && userType === "staff" ? (
              <StaffDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            loggedIn && userType === "doctor" ? (
              <DoctorDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/staff-appointments"
          element={
            loggedIn && userType === "staff" ? (
              <StaffAppointments />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/staff-viewrecords"
          element={
            loggedIn && userType === "staff" ? (
              <StaffViewRecords />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/staff-addpatients"
          element={
            loggedIn && userType === "staff" ? (
              <StaffAddPatients />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/staff-updatepatients"
          element={
            loggedIn && userType === "staff" ? (
              <StaffUpdatePatients />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/staff-deletepatients"
          element={
            loggedIn && userType === "staff" ? (
              <StaffDeletePatients />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
