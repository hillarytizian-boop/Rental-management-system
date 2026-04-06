const router = require('express').Router();
const pool = require('../db');
const authenticate = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/income', authenticate, role('admin', 'landlord'), async (req, res) => {
  const result = await pool.query("SELECT DATE_TRUNC('month', paid_date) as month, SUM(amount) as total FROM payments WHERE status='paid' GROUP BY month ORDER BY month");
  res.json(result.rows);
});

module.exports = router;
