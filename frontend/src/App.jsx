import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import { Appointments } from "./views/appointments";
import { ViewRecords } from "./views/ViewRecords";

function App() {
  return (
    <Router>
      <MenuBar />
      <Routes>
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/view-records" element={<ViewRecords />} />
      </Routes>
    </Router>
  );
}

export default App;
