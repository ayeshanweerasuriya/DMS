const express = require("express");
const authController = require("../../controllers/authController.js");

const router = express.Router();

router.post("/register", authController.signupUser);

router.post("/login", authController.signinUser);

module.exports = router;
