const express = require('express');
const Transaction = require('./models/Transaction'); // Import the Transaction model
const router = express.Router();
const axios = require('axios'); // For fetching data from the third-party API

// Third-party API URL
const API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

// API to initialize the database
router.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        const transactions = response.data;

        // Save transactions to the database
        await Transaction.insertMany(transactions);
        res.status(200).json({ message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).json({ message: 'Failed to initialize database' });
    }
});

// API to list all transactions with search and pagination
router.get('/', async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;

    try {
        const query = {
            dateOfSale: { $regex: new RegExp(month, 'i') }, // Match month in dateOfSale
        };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: { $regex: search, $options: 'i' } },
            ];
        }

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);

        const total = await Transaction.countDocuments(query);
        res.status(200).json({ transactions, total });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
});

// API for statistics
router.get('/statistics', async (req, res) => {
    const { month } = req.query;

    try {
        const totalSales = await Transaction.aggregate([
            { $match: { dateOfSale: { $regex: new RegExp(month, 'i') } } },
            { $group: { _id: null, total: { $sum: '$price' } } },
        ]);

        const totalSold = await Transaction.countDocuments({ dateOfSale: { $regex: new RegExp(month, 'i') } });
        const totalNotSold = await Transaction.countDocuments({ dateOfSale: { $regex: new RegExp(month, 'i') }, price: { $eq: 0 } });

        res.status(200).json({
            totalSales: totalSales[0]?.total || 0,
            totalSold,
            totalNotSold,
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Failed to fetch statistics' });
    }
});

// API for bar chart data
router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;

    try {
        const data = await Transaction.aggregate([
            { $match: { dateOfSale: { $regex: new RegExp(month, 'i') } } },
            {
                $bucket: {
                    groupBy: '$price',
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    default: '901-above',
                    output: { count: { $sum: 1 } },
                },
            },
        ]);

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).json({ message: 'Failed to fetch bar chart data' });
    }
});

// API for pie chart data
router.get('/pie-chart', async (req, res) => {
    const { month } = req.query;

    try {
        const data = await Transaction.aggregate([
            { $match: { dateOfSale: { $regex: new RegExp(month, 'i') } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ message: 'Failed to fetch pie chart data' });
    }
});

//