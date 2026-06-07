const express = require('express');
const router = express.Router();
const db = require('../db');

// Get patient by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, age, gender, phone_number, email, address FROM patients WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update patient
router.put('/:id', async (req, res) => {
    try {
        const { name, age, gender, phone_number, email, address } = req.body;
        await db.execute(
            'UPDATE patients SET name=?, age=?, gender=?, phone_number=?, email=?, address=? WHERE id=?',
            [name, age, gender, phone_number, email, address, req.params.id]
        );
        res.json({ message: 'Patient updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;