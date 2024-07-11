import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { useAuth } from "./context/AuthContext";
import { Appointments } from "./components/Appointments";
import { ViewRecords } from "./components/ViewRecords";
import { AddPatients } from "./components/AddPatients";
import { UpdatePatients } from "./components/UpdatePatients";
import { DeletePatients } from "./components/DeletePatients";

const App = () => {
  const { loggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={loggedIn ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/appointments"
          element={loggedIn ? <Appointments /> : <Navigate to="/" />}
        />
        <Route
          path="/viewrecords"
          element={loggedIn ? <ViewRecords /> : <Navigate to="/" />}
        />
        <Route
          path="/addpatients"
          element={loggedIn ? <AddPatients /> : <Navigate to="/" />}
        />
        <Route
          path="/updatepatients"
          element={loggedIn ? <UpdatePatients /> : <Navigate to="/" />}
        />
        <Route
          path="/deletepatients"
          element={loggedIn ? <DeletePatients /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
