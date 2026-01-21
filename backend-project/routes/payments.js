const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all payments
router.get('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [payments] = await conn.query('SELECT * FROM payments');
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// POST - Add new payment (insert only)
router.post('/', async (req, res) => {
  const { carId, amount, paymentMethod, date } = req.body;

  if (!carId || !amount || !paymentMethod) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const conn = await pool.getConnection();
  try {
    const result = await conn.query('INSERT INTO payments (carId, amount, paymentMethod, date) VALUES (?, ?, ?, ?)', 
      [carId, amount, paymentMethod, date || new Date().toISOString().split('T')[0]]);
    
    res.json({ 
      success: true, 
      message: 'Payment recorded successfully', 
      data: { id: result[0].insertId, carId, amount, paymentMethod, date }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
