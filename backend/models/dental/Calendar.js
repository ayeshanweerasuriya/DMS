const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    date: { type: Date, required: true },
    events: [{ 
        title: { type: String, required: true },
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    }]
});

module.exports = mongoose.model('Calendar', calendarSchema);

// {
//     "_id": "64bf21e895f1b2f12a6d9b30",
//     "appointmentId": "64bf21e895f1b2f12a6d9b2f",
//     "date": "2023-11-15T00:00:00.000Z",
//     "events": [
//         {
//             "title": "John Doe - Routine Checkup",
//             "start": "2023-11-15T10:30:00.000Z",
//             "end": "2023-11-15T11:00:00.000Z"
//         }
//     ]
// }