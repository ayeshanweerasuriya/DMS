const express = require("express");
const appointmentController = require("../../controllers/appointmentController.js");
const authenticate = require("../../middleware/authenticate.js");

const router = express.Router();

router.get("/", authenticate, appointmentController.getAppointments);
router.post("/", authenticate, appointmentController.createAppointment);
router.patch("/:id", authenticate, appointmentController.updateAppointment);
router.delete("/:id", authenticate, appointmentController.deleteAppointment);

module.exports = router;

