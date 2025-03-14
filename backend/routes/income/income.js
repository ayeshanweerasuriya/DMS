const express = require("express");
const incomeController = require("../../controllers/incomeController.js");
const authenticate = require("../../middleware/authenticate.js");

const router = express.Router();

router.get("/", authenticate, incomeController.getIncomeStats);
router.get("/hospital-fee", authenticate, incomeController.getHospitalFee);
router.patch("/hospital-fee", authenticate, incomeController.updateHospitalFee);

module.exports = router;