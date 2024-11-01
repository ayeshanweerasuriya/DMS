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
    medicalHistory: [{
    condition: { type: String, required: true }, // e.g., "Diabetes"
    details: { type: String }, // optional details about the condition
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);