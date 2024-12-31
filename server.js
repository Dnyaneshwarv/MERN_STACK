const express = require('express');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactions');
const connectDB = require('./db'); // Import the connectDB function

const app = express();
app.use(bodyParser.json());

// Connect to the database
connectDB();

app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});