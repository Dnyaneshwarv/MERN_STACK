const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // Import the database connection
const transactionRoutes = require('./api'); // Import the API routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Connect to the database
connectDB();

// Use the transaction routes
app.use('/api/transactions', transactionRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});