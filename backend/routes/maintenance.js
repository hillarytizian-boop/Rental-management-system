const router = require('express').Router();
const pool = require('../db');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  let query = 'SELECT m.*, u.unit_number, pr.name as property_name FROM maintenance_requests m JOIN units u ON m.unit_id = u.id JOIN properties pr ON u.property_id = pr.id';
  const params = [];
  if (req.user.role === 'tenant') {
    query += ' WHERE m.tenant_id = $1';
    params.push(req.user.id);
  }
  const result = await pool.query(query, params);
  res.json(result.rows);
});

router.post('/', authenticate, async (req, res) => {
  const { unit_id, description } = req.body;
  const result = await pool.query('INSERT INTO maintenance_requests (tenant_id, unit_id, description, status) VALUES ($1, $2, $3, $4) RETURNING *', [req.user.id, unit_id, description, 'submitted']);
  res.status(201).json(result.rows[0]);
});

router.patch('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE maintenance_requests SET status=$1 WHERE id=$2', [status, req.params.id]);
  res.json({ message: 'Status updated' });
});

module.exports = router;
