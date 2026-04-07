const router = require('express').Router();
const pool = require('../db');
const authenticate = require('../middleware/auth');
const role = require('../middleware/role');

// All admin routes require admin role
router.use(authenticate, role('admin'));

router.get('/users', async (req, res) => {
  const result = await pool.query('SELECT id, name, email, role, created_at, password_changed FROM users');
  res.json(result.rows);
});

router.put('/users/:id/role', async (req, res) => {
  const { role: newRole } = req.body;
  await pool.query('UPDATE users SET role = $1 WHERE id = $2', [newRole, req.params.id]);
  res.json({ message: 'Role updated' });
});

router.delete('/users/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.status(204).send();
});

module.exports = router;
