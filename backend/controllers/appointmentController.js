const Appointment = require("../models/dental/Appointment.js");

const getAppointments = async (req, res) => {
  try {
    res.json({ mssg: "getAppointments" });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getAppointments,
};
