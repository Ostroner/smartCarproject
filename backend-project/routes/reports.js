const express = require('express');
const router = express.Router();

// GET reports (combines service records and payments with car info)
router.get('/', (req, res) => {
  // This would normally join data from cars, service-records, and payments
  // For now, returning empty array that frontend can populate
  res.json({ 
    success: true, 
    data: [] 
  });
});

module.exports = router;
