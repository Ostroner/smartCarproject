const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [customers] = await conn.query('SELECT * FROM customers');
    res.json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

router.post('/', async (req, res) => {
  const { name, email, phone, address } = req.body;
  
  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  
  const conn = await pool.getConnection();
  try {
    const result = await conn.query('INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)', 
      [name, email, phone, address || '']);
    
    res.status(201).json({ 
      success: true, 
      message: 'Customer created successfully',
      data: { id: result[0].insertId, name, email, phone, address }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

router.get('/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [customers] = await conn.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (customers.length === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.json({ success: true, data: customers[0] });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

router.put('/:id', async (req, res) => {
  const { name, email, phone, address } = req.body;
  
  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  
  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?', 
      [name, email, phone, address, req.params.id]);
    
    res.json({ 
      success: true, 
      message: 'Customer updated successfully',
      data: { id: req.params.id, name, email, phone, address }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

router.delete('/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
