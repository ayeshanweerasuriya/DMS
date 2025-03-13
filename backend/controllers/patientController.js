const Patient = require("../models/dental/Patient.js");

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

  const severityOptions = [
    { label: 'Mild', value: 'Mild' },
    { label: 'Moderate', value: 'Moderate' },
    { label: 'Severe', value: 'Severe' }
];

const addPatient = async (req, res) => {
    try {
        const { name, age, illnessType, contactNumber, dateOfBirth, notes, severityLevel } = req.body;

        // Validate required fields
        if (!name || !age || !illnessType || !contactNumber || !dateOfBirth) {
            return res.status(400).json({ message: "All required fields must be provided.", status: 400});
        }

        // Validate name length
        if (name.length > 100) {
            return res.status(400).json({ message: "Patient name must be at most 100 characters.", status: 400 });
        }

        // Validate age
        if (!Number.isInteger(age) || age < 0 || age > 150) {
            return res.status(400).json({ message: "Patient age must be a valid number between 0 and 150.", status: 400 });
        }

        // Validate illness type length
        if (!illnessTypes.includes(illnessType)) {
            return res.status(400).json({ 
                message: "Invalid illness type. Please select a valid option.", 
                status: 400 
            });
        }

        // Validate contact number
        if (!/^[0-9]{1,10}$/.test(contactNumber)) {
            return res.status(400).json({ message: "Contact number must be numeric and at most 15 digits.", status: 400 });
        }

        // Validate date of birth
        const dob = new Date(dateOfBirth);
        const today = new Date();
        if (isNaN(dob.getTime()) || dob >= today) {
            return res.status(400).json({ message: "Date of birth cannot be today or a future date.", status: 400 });
        }

        // Validate severity level
        if (severityLevel && !severityOptions.map((option) => option.value).includes(severityLevel)) {
            return res.status(400).json({ message: "Invalid severity level. Please select a valid option.", status: 400 });
        }

        // Validate notes length
        if (notes && notes.length > 2500) {
            return res.status(400).json({ message: "Patient notes must be at most 2500 characters.", status: 400 });
        }

        // Create new patient
        const newPatient = new Patient({
            name,
            age,
            illnessType,
            contactNumber,
            dateOfBirth,
            notes,
            severityLevel
        });

        await newPatient.save();
        return res.status(201).json({ message: "Patient added successfully", patient: newPatient, status: 201 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: 500 });
    }
}

const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate date of birth if being updated
        if (updates.dateOfBirth) {
            const dob = new Date(updates.dateOfBirth);
            if (dob >= new Date()) {
                return res.status(400).json({ message: "Date of birth cannot be today or a future date.", status: 400 });
            }
        }

        const updatedPatient = await Patient.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found.", status: 404 });
        }

        res.status(200).json({ message: "Patient updated successfully", patient: updatedPatient, status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
};

const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPatient = await Patient.findByIdAndDelete(id);

        if (!deletedPatient) {
            return res.status(404).json({ message: "Patient not found.", status: 404 });
        }

        res.status(200).json({ message: "Patient deleted successfully", patient: deletedPatient, status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
};

const getPatients = async (req, res) => {
    try {
      const { search, filter } = req.query; // Get search and filter query parameters
  
      let query = {};
  
      // Apply search filter (name or contact number)
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } }, // Case-insensitive name search
          { contactNumber: { $regex: search, $options: "i" } }, // Case-insensitive contact number search
        ];
      }
  
      // Apply illness type filter (ignore if "All" is selected)
      if (filter && filter !== "0") {

        const illnessIndex = parseInt(filter, 10); // Convert key to integer
  
        if (!isNaN(illnessIndex) && illnessIndex > 0 && illnessIndex <= illnessTypes.length) {
          query.illnessType = illnessTypes[illnessIndex - 1]; // Match illnessType based on key
        }
      }
  
      const patients = await Patient.find(query);
      return res
        .status(200)
        .json({ message: "Patients retrieved successfully", patients });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

module.exports = {
    addPatient,
    updatePatient,
    deletePatient,
    getPatients
  };