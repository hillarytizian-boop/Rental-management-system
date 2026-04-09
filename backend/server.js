require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/admin', require('./routes/admin'));

// Dashboard stats – role‑specific
app.get('/api/dashboard/stats', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  let user;
  try {
    user = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
  } catch(e) { return res.status(401).json({ error: 'Invalid token' }); }

  if (user.role === 'tenant') {
    // Tenant sees only their own data
    const tenantId = user.id;
    const rentDue = await pool.query(
      'SELECT COALESCE(SUM(amount),0) FROM payments WHERE tenant_id = $1 AND status = $2',
      [tenantId, 'pending']
    );
    const lastPayment = await pool.query(
      'SELECT COALESCE(amount,0) FROM payments WHERE tenant_id = $1 AND status = $2 ORDER BY paid_date DESC LIMIT 1',
      [tenantId, 'paid']
    );
    const maintenance = await pool.query(
      'SELECT COUNT(*) FROM maintenance_requests WHERE tenant_id = $1 AND status != $2',
      [tenantId, 'resolved']
    );
    res.json({
      rentDue: parseFloat(rentDue.rows[0].sum),
      lastPayment: lastPayment.rows[0]?.amount || 0,
      openMaintenance: parseInt(maintenance.rows[0].count)
    });
  } else if (user.role === 'landlord') {
    // Landlord sees stats for their properties
    const totalRent = await pool.query(
      `SELECT COALESCE(SUM(p.amount),0) FROM payments p
       JOIN units u ON p.unit_id = u.id
       JOIN properties pr ON u.property_id = pr.id
       WHERE pr.landlord_id = $1 AND p.status = $2`,
      [user.id, 'paid']
    );
    const pending = await pool.query(
      `SELECT COALESCE(SUM(p.amount),0) FROM payments p
       JOIN units u ON p.unit_id = u.id
       JOIN properties pr ON u.property_id = pr.id
       WHERE pr.landlord_id = $1 AND p.status = $2`,
      [user.id, 'pending']
    );
    const occupied = await pool.query(
      `SELECT COUNT(*) FROM units u
       JOIN properties pr ON u.property_id = pr.id
       WHERE pr.landlord_id = $1 AND u.is_occupied = true`,
      [user.id]
    );
    const vacant = await pool.query(
      `SELECT COUNT(*) FROM units u
       JOIN properties pr ON u.property_id = pr.id
       WHERE pr.landlord_id = $1 AND u.is_occupied = false`,
      [user.id]
    );
    res.json({
      totalRent: parseFloat(totalRent.rows[0].sum),
      pending: parseFloat(pending.rows[0].sum),
      occupied: parseInt(occupied.rows[0].count),
      vacant: parseInt(vacant.rows[0].count)
    });
  } else {
    // Admin sees all
    const totalRent = await pool.query("SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='paid'");
    const pending = await pool.query("SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='pending'");
    const occupied = await pool.query("SELECT COUNT(*) FROM units WHERE is_occupied=true");
    const vacant = await pool.query("SELECT COUNT(*) FROM units WHERE is_occupied=false");
    res.json({
      totalRent: parseFloat(totalRent.rows[0].sum),
      pending: parseFloat(pending.rows[0].sum),
      occupied: parseInt(occupied.rows[0].count),
      vacant: parseInt(vacant.rows[0].count)
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
