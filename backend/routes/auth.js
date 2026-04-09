const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const existing = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (existing.rows.length) return res.status(409).json({ error: 'Email exists' });
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role',
      [name, email, hash, role || 'tenant']
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!result.rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.post('/accept-invite', async (req, res) => {
  const { token, name, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE invite_token=$1 AND invite_accepted=false', [token]);
    if (!user.rows.length) return res.status(400).json({ error: 'Invalid invite' });
    const hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET name=$1, password_hash=$2, invite_accepted=true, invite_token=NULL WHERE id=$3', [name, hash, user.rows[0].id]);
    const jwtToken = jwt.sign({ id: user.rows[0].id, name, email: user.rows[0].email, role: 'tenant' }, process.env.JWT_SECRET);
    res.json({ token: jwtToken, user: { id: user.rows[0].id, name, email: user.rows[0].email, role: 'tenant' } });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
