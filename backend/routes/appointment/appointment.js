const express = require("express");
const appointmentController = require("../../controllers/appointmentController.js");

const router = express.Router();

router.get("/", appointmentController.getAppointments);

module.exports = router;
