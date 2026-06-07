const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all doctors (for approval)
router.get('/doctors', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, specialization, qualification, contact_number, email, available_time, is_approved FROM doctors');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve doctor
router.put('/doctors/:id/approve', async (req, res) => {
    try {
        await db.execute('UPDATE doctors SET is_approved = TRUE WHERE id = ?', [req.params.id]);
        res.json({ message: 'Doctor approved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete doctor
router.delete('/doctors/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM doctors WHERE id = ?', [req.params.id]);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all patients
router.get('/patients', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, age, gender, phone_number, email, address FROM patients');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete patient
router.delete('/patients/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM patients WHERE id = ?', [req.params.id]);
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;