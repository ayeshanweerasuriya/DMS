const express = require("express");
const aiController = require("../../controllers/aiController.js");
const authenticate = require("../../middleware/authenticate.js");

const router = express.Router();

router.post("/", authenticate, aiController.recommendTreatments);

module.exports = router;

