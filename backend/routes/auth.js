const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// ... existing register and login ...

// Accept invite
router.post('/accept-invite', async (req, res) => {
  const { token, name, password } = req.body;
  if (!token || !name || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const user = await pool.query('SELECT * FROM users WHERE invite_token = $1 AND invite_accepted = false', [token]);
    if (user.rows.length === 0) return res.status(400).json({ error: 'Invalid or expired invite' });
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(`
      UPDATE users SET name = $1, password_hash = $2, invite_accepted = true, invite_token = NULL
      WHERE id = $3
    `, [name, hashed, user.rows[0].id]);
    const jwtToken = jwt.sign(
      { id: user.rows[0].id, name, email: user.rows[0].email, role: 'tenant' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token: jwtToken, user: { id: user.rows[0].id, name, email: user.rows[0].email, role: 'tenant' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
