const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all service records
router.get('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [records] = await conn.query('SELECT * FROM service_records');
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// POST - Add new service record
router.post('/', async (req, res) => {
  const { carId, serviceId, description, cost, date } = req.body;

  if (!carId || !serviceId || !cost) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const conn = await pool.getConnection();
  try {
    const result = await conn.query('INSERT INTO service_records (carId, serviceId, description, cost, date) VALUES (?, ?, ?, ?, ?)', 
      [carId, serviceId, description || '', cost, date || new Date().toISOString().split('T')[0]]);
    
    res.json({ 
      success: true, 
      message: 'Service record added successfully', 
      data: { id: result[0].insertId, carId, serviceId, description, cost, date }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// PUT - Update service record
router.put('/:id', async (req, res) => {
  const { carId, serviceId, description, cost, date } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE service_records SET carId = ?, serviceId = ?, description = ?, cost = ?, date = ? WHERE id = ?', 
      [carId, serviceId, description, cost, date, req.params.id]);
    
    res.json({ 
      success: true, 
      message: 'Service record updated successfully', 
      data: { id: req.params.id, carId, serviceId, description, cost, date }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// DELETE - Remove service record
router.delete('/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query('DELETE FROM service_records WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Service record not found' });
    }
    res.json({ success: true, message: 'Service record deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
