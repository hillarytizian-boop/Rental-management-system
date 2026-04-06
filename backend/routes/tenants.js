const router = require('express').Router();
const pool = require('../db');
const authenticate = require('../middleware/auth');
const role = require('../middleware/role');
const bcrypt = require('bcryptjs');

router.get('/', authenticate, role('admin', 'landlord'), async (req, res) => {
  const result = await pool.query('SELECT id, name, email, role FROM users WHERE role = $1', ['tenant']);
  res.json(result.rows);
});

router.post('/', authenticate, role('admin', 'landlord'), async (req, res) => {
  const { name, email, password, unit_id } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  const userResult = await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id', [name, email, hashed, 'tenant']);
  const tenantId = userResult.rows[0].id;
  if (unit_id) {
    await pool.query('UPDATE units SET is_occupied=true, current_tenant_id=$1 WHERE id=$2', [tenantId, unit_id]);
  }
  res.status(201).json({ id: tenantId, name, email });
});

router.get('/:id/lease', authenticate, async (req, res) => {
  const result = await pool.query('SELECT * FROM leases WHERE tenant_id=$1', [req.params.id]);
  res.json(result.rows);
});

module.exports = router;
