const express = require("express");
const patientController = require("../../controllers/patientController.js");

const router = express.Router();

router.post("/", patientController.addPatient);
router.patch("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);

module.exports = router;
