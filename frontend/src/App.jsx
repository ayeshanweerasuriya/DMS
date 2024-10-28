import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MenuBar } from "./components/menubar/ManuBar";
import { Appointments } from "./views/appointments";
import { ViewRecords } from "./views/ViewRecords";
import { AddPatients } from "./views/AddPatients";
import { UpdatePatients } from "./views/UpdatePatients";
import { DeletePatients } from "./views/DeletePatients";
import { LogIn } from "./views/login/LogIn";

function App() {
  return (
    // <div>
    // <LogIn />
    // </div>
    <Router>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div style={{ width: "300px" }}>
          <MenuBar />
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/view-records" element={<ViewRecords />} />
            <Route path="/add-patients" element={<AddPatients />} />
            <Route path="/update-patients" element={<UpdatePatients />} />
            <Route path="/delete-patients" element={<DeletePatients />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
