const router = require('express').Router();
const pool = require('../db');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  let query = 'SELECT p.*, u.unit_number, pr.name as property_name FROM payments p JOIN units u ON p.unit_id = u.id JOIN properties pr ON u.property_id = pr.id';
  const params = [];
  if (req.user.role === 'tenant') {
    query += ' WHERE p.tenant_id = $1';
    params.push(req.user.id);
  }
  const result = await pool.query(query, params);
  res.json(result.rows);
});

router.post('/', authenticate, async (req, res) => {
  const { tenant_id, unit_id, amount, due_date } = req.body;
  const result = await pool.query('INSERT INTO payments (tenant_id, unit_id, amount, due_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', [tenant_id, unit_id, amount, due_date, 'pending']);
  res.status(201).json(result.rows[0]);
});

router.post('/mpesa/initiate', authenticate, async (req, res) => {
  // M-Pesa integration placeholder – add real logic later
  res.json({ message: 'M-Pesa integration not yet implemented' });
});

router.post('/mpesa/callback', async (req, res) => {
  res.json({ ResultCode: 0 });
});

module.exports = router;
