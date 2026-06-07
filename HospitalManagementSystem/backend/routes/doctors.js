const express = require('express');
const router = express.Router();
const db = require('../db');

// Get approved doctors
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, specialization, qualification, contact_number, email, available_time FROM doctors WHERE is_approved = TRUE');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, specialization, qualification, contact_number, email, available_time FROM doctors WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update doctor availability
router.put('/:id/availability', async (req, res) => {
    try {
        const { available_time } = req.body;
        await db.execute('UPDATE doctors SET available_time = ? WHERE id = ?', [available_time, req.params.id]);
        res.json({ message: 'Availability updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;