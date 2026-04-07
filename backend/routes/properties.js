const router = require('express').Router();
const pool = require('../db');
const authenticate = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', authenticate, async (req, res) => {
  try {
    let query = 'SELECT p.* FROM properties p';
    const params = [];
    if (req.user.role === 'landlord') {
      query += ' WHERE p.landlord_id = $1';
      params.push(req.user.id);
    } else if (req.user.role === 'tenant') {
      query += ' JOIN units u ON u.property_id = p.id WHERE u.current_tenant_id = $1';
      params.push(req.user.id);
    }
    // Admin sees all – no filter
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', authenticate, role('admin', 'landlord'), async (req, res) => {
  const { name, address, total_units, image_url } = req.body;
  const landlordId = req.user.role === 'landlord' ? req.user.id : req.body.landlord_id;
  if (!landlordId) return res.status(400).json({ error: 'landlord_id required' });
  try {
    const result = await pool.query(
      'INSERT INTO properties (name, address, total_units, image_url, landlord_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, address, total_units, image_url, landlordId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update, delete similarly – add landlord_id check in WHERE
router.put('/:id', authenticate, role('admin', 'landlord'), async (req, res) => {
  const { name, address, total_units, image_url } = req.body;
  const id = req.params.id;
  let query = 'UPDATE properties SET name=$1, address=$2, total_units=$3, image_url=$4 WHERE id=$5';
  const params = [name, address, total_units, image_url, id];
  if (req.user.role === 'landlord') {
    query += ' AND landlord_id = $6';
    params.push(req.user.id);
  }
  try {
    const result = await pool.query(query + ' RETURNING *', params);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Property not found or unauthorized' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', authenticate, role('admin', 'landlord'), async (req, res) => {
  const id = req.params.id;
  let query = 'DELETE FROM properties WHERE id=$1';
  const params = [id];
  if (req.user.role === 'landlord') {
    query += ' AND landlord_id = $2';
    params.push(req.user.id);
  }
  const result = await pool.query(query, params);
  if (result.rowCount === 0) return res.status(404).json({ error: 'Property not found or unauthorized' });
  res.status(204).send();
});

module.exports = router;
