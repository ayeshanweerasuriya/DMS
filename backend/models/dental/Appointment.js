const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    dentist: { type: String, required: true }, // dentist's name or ID
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true }, // e.g., "10:30 AM"
    reason: { type: String }, // e.g., "Routine Checkup", "Root Canal"
    status: { 
        type: String, 
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
        default: 'Scheduled'
    },
    verified: { type: Boolean, default: false }, // marks if the appointment is verified post-visit
    notes: { type: String }, // dentist notes after appointment
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);

// {
//     "_id": "64bf21e895f1b2f12a6d9b2f",
//     "patientId": "64bf21e895f1b2f12a6d9b2e",
//     "dentist": "Dr. Smith",
//     "appointmentDate": "2023-11-15T00:00:00.000Z",
//     "appointmentTime": "10:30 AM",
//     "reason": "Routine Checkup",
//     "status": "Scheduled",
//     "verified": false,
//     "notes": "",
//     "createdAt": "2023-10-30T12:35:01.123Z"
// }
