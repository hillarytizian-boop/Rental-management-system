require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const tenantRoutes = require('./routes/tenants');
const paymentRoutes = require('./routes/payments');
const maintenanceRoutes = require('./routes/maintenance');
const reportRoutes = require('./routes/reports');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reports', reportRoutes);

// Root route
app.get('/', (req, res) => res.json({ message: 'Rental Management API is running' }));

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalRent = await pool.query("SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='paid'");
    const pending = await pool.query("SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='pending'");
    const occupied = await pool.query("SELECT COUNT(*) FROM units WHERE is_occupied=true");
    const vacant = await pool.query("SELECT COUNT(*) FROM units WHERE is_occupied=false");
    res.json({
      totalRent: parseFloat(totalRent.rows[0].sum),
      pending: parseFloat(pending.rows[0].sum),
      occupied: parseInt(occupied.rows[0].count),
      vacant: parseInt(vacant.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
