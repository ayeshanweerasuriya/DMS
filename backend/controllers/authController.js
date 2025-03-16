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

const updateUser = async (req, res) => {
  const { userId, password, newPassword, displayName, role } = req.body;

  if (!userId || !password || !newPassword || !displayName || !role) {
    return res.status(400).json({ error: "User ID, old password, new password, role, and new display name are required", status: 400 });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found", status: 404 });
    }

    // Compare the old password with the stored password
    const isOldPasswordValid = await bcrypt.compare(password, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({ error: "Old password is incorrect", status: 401 });
    }

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and display name
    user.password = hashedPassword;
    user.displayname = displayName;
    user.role = role;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({
      message: "User information updated successfully",
      displayname: user.displayname,
      username: user.username,
      role: user.role,
      status: 200
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", status: 500 });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.body;

  console.log("userId: ", userId);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required", status: 400 });
  }

  try {
    // Find the user by ID and delete
    const user = await User.findByIdAndDelete(userId); // Use findByIdAndDelete instead of find and then remove
    if (!user) {
      return res.status(404).json({ error: "User not found", status: 404 });
    }

    res.status(200).json({
      message: "User deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", status: 500 });
  }
};

const getAccountDetails = async (req, res) => {
  try {
    const { search, filter } = req.query;

    // Build the search query filter (only for users data, not counts)
    let searchCriteria = {};
    if (search) {
      // Perform a case-insensitive search on displayname and username
      const searchRegex = new RegExp(search, 'i');
      searchCriteria = {
        $or: [
          { displayname: { $regex: searchRegex } },
          { username: { $regex: searchRegex } }
        ]
      };
    }

    // Apply filter if provided (if no filter, it returns all roles)
    let filterCriteria = {};
    if (filter && filter !== "All") {
      filterCriteria.role = filter;  // Apply filter based on role
    }

    // Combine search and filter criteria for users data
    const query = { ...searchCriteria, ...filterCriteria };

    // Get the total user count (this should not be influenced by search or filter)
    const totalUsersCount = await User.countDocuments();  // Total count for all users

    // Get the count of users by role (these counts should not be filtered by search or filter)
    const staffCount = await User.countDocuments({ role: 'Staff' });
    const doctorCount = await User.countDocuments({ role: 'Doctor' });
    const adminCount = await User.countDocuments({ role: 'Admin' });

    // Get users based on the query (search and filter)
    const users = await User.find(query).select('-password');

    // Respond with account details (total counts and filtered users based on search and filter)
    return res.status(200).json({
      totalUsersCount,
      staffCount,
      doctorCount,
      adminCount,
      users,  // Return all users matching search and filter
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while fetching account details.',
    });
  }
};

module.exports = { signupUser, signinUser, updateUser, getAccountDetails, deleteUser };