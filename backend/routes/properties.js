const router = require('express').Router();
const pool = require('../db');
const authenticate = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', authenticate, async (req, res) => {
  try {
    let query = 'SELECT * FROM properties';
    const params = [];
    if (req.user.role === 'landlord') {
      query += ' WHERE landlord_id = $1';
      params.push(req.user.id);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', authenticate, role('admin', 'landlord'), async (req, res) => {
  const { name, address, total_units, image_url } = req.body;
  try {
    const result = await pool.query('INSERT INTO properties (name, address, total_units, image_url, landlord_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, address, total_units, image_url, req.user.role === 'landlord' ? req.user.id : null]);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', authenticate, role('admin', 'landlord'), async (req, res) => {
  const { name, address, total_units, image_url } = req.body;
  try {
    const result = await pool.query('UPDATE properties SET name=$1, address=$2, total_units=$3, image_url=$4 WHERE id=$5 RETURNING *', [name, address, total_units, image_url, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', authenticate, role('admin', 'landlord'), async (req, res) => {
  await pool.query('DELETE FROM properties WHERE id=$1', [req.params.id]);
  res.status(204).send();
});

module.exports = router;
