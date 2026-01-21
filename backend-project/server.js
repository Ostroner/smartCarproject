const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
let pool;
let useMemoryDB = false;

try {
  pool = require('./db');
  pool.getConnection().then(conn => {
    console.log('✅ MySQL connected successfully');
    conn.release();
  }).catch(err => {
    console.log('⚠️ MySQL not available - using in-memory database');
    useMemoryDB = true;
  });
} catch (err) {
  console.log('⚠️ MySQL not available - using in-memory database');
  useMemoryDB = true;
}

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const carsRoutes = require('./routes/cars');
const servicesRoutes = require('./routes/services');
const serviceRecordsRoutes = require('./routes/service-records');
const paymentsRoutes = require('./routes/payments');
const reportsRoutes = require('./routes/reports');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/service-records', serviceRecordsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reports', reportsRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
