const express = require('express');
const haversine = require('haversine');
const router = express.Router();

// Add a new school
router.post('/addschool', (req, res) => {
    const { name, latitude, longitude } = req.body;

    if (!name || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields (name, latitude, longitude) are required.' });
    }

    const db = req.app.locals.db;
    const query = 'INSERT INTO schools (name, latitude, longitude) VALUES (?, ?, ?)';
    db.query(query, [name, latitude, longitude], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error.' });
        }
        res.status(201).json({ message: 'School added successfully.', schoolId: result.insertId });
    });
});

// Retrieve schools sorted by proximity
router.get('/schools', (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    const db = req.app.locals.db;

    const query = 'SELECT * FROM schools';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error.' });
        }

        const schoolsWithDistance = results.map(school => {
            const schoolLocation = { latitude: school.latitude, longitude: school.longitude };
            const distance = haversine(userLocation, schoolLocation, { unit: 'meter' });
            return { ...school, distance };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(schoolsWithDistance);
    });
});

module.exports = router;
