const express = require('express');
const bcryptjs = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }
  
  const conn = await pool.getConnection();
  try {
    const existingUser = await conn.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser[0].length > 0) {
      return res.status(400).json({ success: false, error: 'Username or email already exists' });
    }
    
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    await conn.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: { username, email }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const conn = await pool.getConnection();
  try {
    const [users] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
    
    const user = users[0];
    const isMatch = await bcryptjs.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
    
    res.json({ 
      success: true, 
      user: { id: user.id, username: user.username, email: user.email },
      message: 'Login successful'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

router.post('/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  
  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }
  
  const conn = await pool.getConnection();
  try {
    const [users] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const user = users[0];
    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await conn.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
    
    res.json({ 
      success: true, 
      message: 'Password changed successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;


module.exports = router;
