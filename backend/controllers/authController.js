const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/auth/User");

const signupUser = async (req, res) => {
  const { displayname, username, password, role } = req.body;

  // Allowed roles
  const allowedRoles = ["Staff", "Doctor", "Admin"];

  if (!displayname || !username || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate role
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role. Allowed roles: Staff, Doctor, Admin" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ displayname, username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      displayname,
      username,
      role,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const signinUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username or password is not defined" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jsonwebtoken.sign(
      { userId: user._id, username: user.username, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({
      message: "User logged in successfully!",
      username: user.username,
      displayname: user.displayname,
      role: user.role,
      token, // Send JWT token for authentication
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = { signupUser, signinUser };