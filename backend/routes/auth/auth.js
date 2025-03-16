const express = require("express");
const authController = require("../../controllers/authController.js");
const authenticate = require("../../middleware/authenticate.js");

const router = express.Router();

router.post("/register", authController.signupUser);
router.post("/login", authController.signinUser);
router.get("/account-details", authenticate, authController.getAccountDetails);
router.patch("/update-account", authenticate, authController.updateUser);
router.delete("/delete-account", authenticate, authController.deleteUser);

module.exports = router;
