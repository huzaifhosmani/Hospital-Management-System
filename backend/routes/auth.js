const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Patient Registration
router.post('/patient/register', async (req, res) => {
    try {
        const { name, age, gender, phone_number, email, address, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.execute(
            'INSERT INTO patients (name, age, gender, phone_number, email, address, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, age, gender, phone_number, email, address, hashedPassword]
        );
        
        res.json({ message: 'Patient registered successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Patient Login
router.post('/patient/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [rows] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const patient = rows[0];
        const validPassword = await bcrypt.compare(password, patient.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: patient.id, role: 'patient' }, 'secret_key', { expiresIn: '1h' });
        res.json({ token, patientId: patient.id, role: 'patient' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Doctor Registration
router.post('/doctor/register', async (req, res) => {
    try {
        const { name, specialization, qualification, contact_number, email, available_time, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.execute(
            'INSERT INTO doctors (name, specialization, qualification, contact_number, email, available_time, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, specialization, qualification, contact_number, email, available_time, hashedPassword]
        );
        
        res.json({ message: 'Doctor registered successfully, waiting for admin approval', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Doctor Login
router.post('/doctor/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [rows] = await db.execute('SELECT * FROM doctors WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const doctor = rows[0];
        if (!doctor.is_approved) {
            return res.status(403).json({ error: 'Account not approved by admin' });
        }
        
        const validPassword = await bcrypt.compare(password, doctor.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: doctor.id, role: 'doctor' }, 'secret_key', { expiresIn: '1h' });
        res.json({ token, doctorId: doctor.id, role: 'doctor' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [rows] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const admin = rows[0];
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: admin.id, role: 'admin' }, 'secret_key', { expiresIn: '1h' });
        res.json({ token, adminId: admin.id, role: 'admin' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;