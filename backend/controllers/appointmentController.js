const Appointment = require("../models/dental/Appointment.js");

// Get all appointments
const getAppointments = async (req, res) => {
  try {
      const appointments = await Appointment.find();
      return res.status(200).json({ message: "Appointments retrieved successfully", appointments });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
      const { patientName, appointmentDate, appointmentTime, contactNumber, patientAge } = req.body;

      // Validate required fields
      if (!patientName || !appointmentDate || !appointmentTime || !contactNumber || !patientAge) {
          return res.status(400).json({ message: "All required fields must be provided.", status: 400 });
      }

      // Validate patient name length
      if (patientName.length > 100) {
          return res.status(400).json({ message: "Patient name must be at most 100 characters.", status: 400 });
      }

      // Validate appointment date
      const date = new Date(appointmentDate);
      if (isNaN(date.getTime()) || date < new Date()) {
          return res.status(400).json({ message: "Appointment date must be a valid future date.", status: 400 });
      }

      // Validate appointment time (basic format check)
      if (!/^\d{1,2}:\d{2} (AM|PM)$/.test(appointmentTime)) {
          return res.status(400).json({ message: "Invalid appointment time format. Use HH:MM AM/PM.", status: 400 });
      }

      // Validate contact number
      if (!/^[0-9]{1,15}$/.test(contactNumber)) {
          return res.status(400).json({ message: "Contact number must be numeric and at most 15 digits.", status: 400 });
      }

      // Validate patient age
      if (!Number.isInteger(patientAge) || patientAge < 0 || patientAge > 150) {
          return res.status(400).json({ message: "Patient age must be a valid number between 0 and 150.", status: 400 });
      }

      // Create new appointment
      const newAppointment = new Appointment({
          patientName,
          appointmentDate,
          appointmentTime,
          contactNumber,
          patientAge,
      });

      await newAppointment.save();
      return res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment, status: 200 });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", status: 500 });
  }
};

module.exports = {
  getAppointments,
  createAppointment
};
