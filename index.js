// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import the Attendance model
const Attendance = require('./models/Attendance');

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Define the port number from environment variables or use 5000 as default
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// POST route to save attendance data
app.post('/attend', async (req, res) => {
  try {
    // Extract data from request body
    const { username, fullName, time } = req.body;

    // Data validation
    if (!username || !fullName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and full name are required' 
      });
    }

    // Create a new attendance record
    const newAttendance = new Attendance({
      username,
      fullName,
      time: time || new Date() // Use provided time or current time
    });

    // Save the attendance record to database
    await newAttendance.save();

    // Send success response
    return res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: newAttendance
    });

  } catch (error) {
    console.error('Error saving attendance:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Simple GET route to test if the server is running
app.get('/', (req, res) => {
  res.send('Attendance API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
