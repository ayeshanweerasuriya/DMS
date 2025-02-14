const Calendar = require("../models/dental/Calendar.js");
// Fetch calendar data (patient name, appointment date, and appointment time)
const getCalendarAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({}, "patientName appointmentDate appointmentTime");

        // Check if appointments exist
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found", status: 404 });
        }

        // Validate date format
        const validAppointments = appointments.filter(app => {
            const isValidDate = !isNaN(new Date(app.appointmentDate).getTime());
            return isValidDate;
        });

        if (validAppointments.length === 0) {
            return res.status(400).json({ message: "Invalid appointment date format in records", status: 400 });
        }

        return res.status(200).json({
            message: "Calendar data retrieved successfully",
            appointments: validAppointments,
            status: 200
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: 500 });
    }
};

module.exports = {
    getCalendarAppointments
};
