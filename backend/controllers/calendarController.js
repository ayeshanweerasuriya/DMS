const Appointment = require("../models/dental/Appointment.js");

const getCalendarData = async (req, res) => {
    try {
        // Get the current date to determine if the date is today or in the future
        const currentDate = new Date().setHours(0, 0, 0, 0); // Normalize to 00:00:00 for accurate comparison

        // Query appointments and group them by appointmentDate
        const appointments = await Appointment.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" } },
                    appointments: {
                        $push: {
                            patientName: "$patientName",
                            appointmentDate: "$appointmentDate",
                            appointmentTime: "$appointmentTime",
                            contactNumber: "$contactNumber",
                            patientAge: "$patientAge",
                            createdAt: "$createdAt"
                        }
                    }
                }
            },
            {
                $sort: { "_id": 1 } // Sort by date in ascending order
            }
        ]);

        // Structure the response data
        const result = appointments.map(appointment => {
            const date = appointment._id; // This will be the date string like '2023-11-15'
            const totalAppointments = appointment.appointments.length;
            const active = new Date(date) >= currentDate; // Check if it's today or in the future

            return {
                date: date,
                totalAppointments: totalAppointments,
                active: active,
                appointments: appointment.appointments
            };
        });

        return res.status(200).json(result); // Send back the formatted response

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: 500 });
    }
};

module.exports = {
    getCalendarData
};
