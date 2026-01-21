const express = require('express');
const router = express.Router();

// Predefined services
const services = [
  { id: 1, name: 'Engine repair', price: 150000 },
  { id: 2, name: 'Transmission repair', price: 80000 },
  { id: 3, name: 'Oil Change', price: 60000 },
  { id: 4, name: 'Chain replacement', price: 40000 },
  { id: 5, name: 'Disc replacement', price: 400000 },
  { id: 6, name: 'Wheel alignment', price: 5000 }
];

// GET all services (predefined)
router.get('/', (req, res) => {
  res.json({ success: true, data: services });
});

module.exports = router;
