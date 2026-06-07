const express = require('express');
const router = express.Router();
const db = require('../db');

// Book appointment
router.post('/', async (req, res) => {
    try {
        const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;
        const [result] = await db.execute(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)',
            [patient_id, doctor_id, appointment_date, appointment_time]
        );
        res.json({ message: 'Appointment booked successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get appointments by patient
router.get('/patient/:patientId', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT a.*, d.name as doctor_name, d.specialization 
            FROM appointments a 
            JOIN doctors d ON a.doctor_id = d.id 
            WHERE a.patient_id = ?
        `, [req.params.patientId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get appointments by doctor
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT a.*, p.name as patient_name, p.phone_number 
            FROM appointments a 
            JOIN patients p ON a.patient_id = p.id 
            WHERE a.doctor_id = ?
        `, [req.params.doctorId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update appointment status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await db.execute('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Appointment status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all appointments (admin)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT a.*, p.name as patient_name, d.name as doctor_name 
            FROM appointments a 
            JOIN patients p ON a.patient_id = p.id 
            JOIN doctors d ON a.doctor_id = d.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;