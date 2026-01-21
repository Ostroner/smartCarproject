const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all cars
router.get('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [cars] = await conn.query('SELECT * FROM cars');
    res.json({ success: true, data: cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// POST - Add new car
router.post('/', async (req, res) => {
  const { licensePlate, make, model, year, ownerName } = req.body;

  if (!licensePlate || !make || !model) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const conn = await pool.getConnection();
  try {
    const result = await conn.query('INSERT INTO cars (licensePlate, make, model, year, ownerName) VALUES (?, ?, ?, ?, ?)', 
      [licensePlate, make, model, year || new Date().getFullYear(), ownerName || 'Unknown']);
    
    res.json({ 
      success: true, 
      message: 'Car added successfully', 
      data: { id: result[0].insertId, licensePlate, make, model, year, ownerName }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// PUT - Update car
router.put('/:id', async (req, res) => {
  const { licensePlate, make, model, year, ownerName } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE cars SET licensePlate = ?, make = ?, model = ?, year = ?, ownerName = ? WHERE id = ?', 
      [licensePlate, make, model, year, ownerName, req.params.id]);
    
    res.json({ 
      success: true, 
      message: 'Car updated successfully', 
      data: { id: req.params.id, licensePlate, make, model, year, ownerName }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// DELETE - Remove car
router.delete('/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query('DELETE FROM cars WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
