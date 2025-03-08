const express = require("express");
const cors = require("cors");
const AuthRouter = require("./routes/auth/auth.js");
const PatientRouter = require("./routes/patient/patient.js");
const AppointmentRouter = require("./routes/appointment/appointment.js");
const CalendarRouter = require("./routes/calendar/calendar.js");
const IncomeRouter = require("./routes/income/income.js");
const connectToDatabase = require("./db");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: "http://localhost:5173", // replace with your frontend URL if different
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method + " - " + req.url);
  next();
});

app.use("/auth", AuthRouter);
app.use("/api/patient", PatientRouter);
app.use("/api/appointment", AppointmentRouter);
app.use("/api/calendar", CalendarRouter);
app.use("/api/income", IncomeRouter);

app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port:`, PORT);
  });
});
