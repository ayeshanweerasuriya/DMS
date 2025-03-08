const mongoose = require('mongoose');

const illnessTypes = [
    "Cavities",
    "Gingivitis",
    "Periodontitis",
    "Tooth Decay",
    "Oral Cancer",
    "Bruxism",
    "Impacted Teeth",
    "Tooth Sensitivity",
    "Halitosis",
    "TMJ Disorders",
    "Other",
  ];

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    age: { type: Number, required: true, min: 0, max: 150 },
    illnessType: { 
        type: String, 
        required: true, 
        enum: illnessTypes, // Only accepts these values
        maxlength: 200 
      },
    contactNumber: { type: String, required: true, match: /^[0-9]{1,15}$/ },
    dateOfBirth: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return value < new Date();
            },
            message: "Date of birth cannot be today or a future date."
        }
    },
    treatmentFee: { type: Number, maxlength: 2500, min: 0 },
    medicationFee: { type: Number, maxlength: 2500, min: 0 },
    hospitalFee: { type: Number, maxlength: 2500, min: 0 },
    notes: { type: String, maxlength: 2500 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);