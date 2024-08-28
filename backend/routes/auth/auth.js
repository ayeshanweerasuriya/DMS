const express = require("express");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const authController = require("../../controllers/authController.js");

const router = express.Router();

router.post("/register", authController.createUser);

router.post("/login", authController.getUser);

module.exports = router;
