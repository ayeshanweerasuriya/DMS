const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/auth/User.js");
require('dotenv').config();

const signupUser = async (req, res) => {
  const { displayname, username, password, role } = req.body;

  // Allowed roles
  const allowedRoles = ["Staff", "Doctor", "Admin"];

  if (!displayname || !username || !password || !role) {
    return res.status(400).json({ error: "All fields are required", status: 400 });
  }

  // Validate role
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role. Allowed roles: Staff, Doctor, Admin", status: 400 });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists", status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ displayname, username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      displayname,
      username,
      role,
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", status: 500 });
  }
};

const signinUser = async (req, res) => {
  const { username, password } = req.body;
  // console.log("username: ", username);
  // console.log("password: ", password);

  if (!username || !password) {
    return res.status(400).json({ error: "Username or password is not defined" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password", status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password", status: 401 });
    }

    // Generate JWT Token
    const token = jsonwebtoken.sign(
      { userId: user._id, username: user.username, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User logged in successfully!",
      username: user.username,
      displayname: user.displayname,
      role: user.role,
      token, // Send JWT token for authentication
      status: 200
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", status: 500 });
  }
};

module.exports = { signupUser, signinUser };