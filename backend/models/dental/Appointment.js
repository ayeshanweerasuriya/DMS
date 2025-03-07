const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
   
    patientName: { type: String, required: true }, // Patient's Name
    appointmentDate: {
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return value >= new Date().setHours(0, 0, 0, 0); // Allow only today or future dates
            },
            message: "Appointment date should be today or future"
        }
    },
    
    appointmentTime: { type: String, required: true }, // Appointment Time
    contactNumber: { type: String, required: true,match: /^[0-9]{1,15}$/ }, // Contact Number
    patientAge: { type: Number, required: true, min: 0, max: 150 }, // Patient Age
    createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model('Appointment', appointmentSchema);

// {
//     "patientName": "AA Weerasuriya",
//     "appointmentDate": "2023-11-15T00:00:00.000Z",
//     "appointmentTime": "10:30 AM",
//     "contactNumber": "0776655432",
//     "patientAge": 23,
//     "createdAt": "2023-10-30T12:35:01.123Z"
// }
