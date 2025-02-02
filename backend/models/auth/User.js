const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  displayname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Staff', 'Doctor', 'Admin'],
  },
  password: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model('User', userSchema);