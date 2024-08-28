const express = require("express");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const router = express.Router();

router.post("/register", (req, res) => {
  const { displayname, username, password } = req.body;

  if (username === "username") {
    return res.status(409).send("username is already exist");
  }

  res.send({
    mssg: "User created successfully",
    displayname,
    username,
    password,
  });
});

router.post("/login", (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.send("username or password is not defined");
  }

  res.send({
    mssg: "User logged in Successfully!",
    id,
    password,
  });
});

module.exports = router;
