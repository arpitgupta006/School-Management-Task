const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const haversine = require('haversine');
const schoolRoutes = require('./routes/schools');

const app = express();

// Middleware
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'password', // Replace with your MySQL password
    database: 'school_data' // Replace with your database name
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database.');
});

// Share database connection with routes
app.locals.db = db;

// Routes
app.use('/schools', schoolRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:5000`);
});
