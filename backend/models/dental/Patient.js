const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    contactInfo: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String }
    },
    medicalHistory: [{ type: String }], // e.g., "Allergies", "Diabetes"
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);


// {
//     "_id": "64bf21e895f1b2f12a6d9b2e",
//     "firstName": "John",
//     "lastName": "Doe",
//     "dateOfBirth": "1990-05-15T00:00:00.000Z",
//     "contactInfo": {
//         "phone": "+123456789",
//         "email": "john.doe@example.com",
//         "address": "123 Main St, Springfield"
//     },
//     "medicalHistory": ["Allergies", "High Blood Pressure"],
//     "createdAt": "2023-10-30T12:34:56.789Z"
// }