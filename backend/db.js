const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function connectToDatabase() {
    try {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB with Mongoose');
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      throw error;
    }
  }
  
  module.exports = connectToDatabase;