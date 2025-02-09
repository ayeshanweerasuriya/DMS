const express = require("express");
const appointmentController = require("../../controllers/appointmentController.js");
const authenticate = require("../../middleware/authenticate.js");

const router = express.Router();

router.get("/", authenticate, appointmentController.getAppointments);
router.post("/", appointmentController.createAppointment);

module.exports = router;

