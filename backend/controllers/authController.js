const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require('../models/auth/User');

const createUser = async (req, res) => {
  const { displayname, username, password } = req.body;

  if (!displayname || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ displayname, username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      displayname,
      username,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ mssg: "Username or password is not defined" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ mssg: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ mssg: "Invalid credentials" });
    }

    res.send({
      mssg: "User logged in successfully!",
      username: user.username,
      displayname: user.displayname,
    });
  } catch (error) {
    res.status(500).json({ mssg: "Server error", error });
  }
};

module.exports = { createUser, getUser };