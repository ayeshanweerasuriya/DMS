const express = require("express");
const incomeController = require("../../controllers/incomeController.js");
const authenticate = require("../../middleware/authenticate.js");

const router = express.Router();

router.get("/", authenticate, incomeController.getIncomeStats);
router.patch("/", authenticate, incomeController.updateHospitalFee);

module.exports = router;