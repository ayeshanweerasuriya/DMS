const express = require("express");
const patientController = require("../../controllers/patientController.js");
const authenticate = require("../../middleware/authenticate.js");

const router = express.Router();

router.get("/", authenticate, patientController.getPatients);
router.post("/", authenticate, patientController.addPatient);
router.patch("/:id", authenticate, patientController.updatePatient);
router.delete("/:id", authenticate, patientController.deletePatient);

module.exports = router;
