const mongoose = require('mongoose');

// MongoDB connection URI
const dbURI = 'mongodb://localhost:27017/roxiler';

// Function to connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Export the connectDB function
module.exports = connectDB;