const express = require("express");
const calendarController = require("../../controllers/calendarController.js");
const authenticate = require("../../middleware/authenticate.js");

const router = express.Router();

router.get("/", authenticate, calendarController.getCalendarAppointments);

module.exports = router;