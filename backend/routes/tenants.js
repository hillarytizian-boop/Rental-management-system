const router = require('express').Router();
const pool = require('../db');
const authenticate = require('../middleware/auth');
const role = require('../middleware/role');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Get tenants (landlord sees only tenants of their properties, admin sees all)
router.get('/', authenticate, role('admin', 'landlord'), async (req, res) => {
  let query = `
    SELECT DISTINCT u.id, u.name, u.email, u.role, u.invite_accepted
    FROM users u
  `;
  const params = [];
  if (req.user.role === 'landlord') {
    query += `
      JOIN payments p ON p.tenant_id = u.id
      JOIN units un ON un.id = p.unit_id
      JOIN properties pr ON pr.id = un.property_id
      WHERE pr.landlord_id = $1
    `;
    params.push(req.user.id);
  }
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// Invite a tenant (landlord or admin)
router.post('/invite', authenticate, role('admin', 'landlord'), async (req, res) => {
  const { email, property_id, unit_id } = req.body;
  if (!email || !property_id || !unit_id) return res.status(400).json({ error: 'Missing fields' });
  try {
    // Verify property belongs to this landlord (if landlord)
    if (req.user.role === 'landlord') {
      const prop = await pool.query('SELECT id FROM properties WHERE id=$1 AND landlord_id=$2', [property_id, req.user.id]);
      if (prop.rows.length === 0) return res.status(403).json({ error: 'Property not owned by you' });
    }
    const inviteToken = crypto.randomBytes(32).toString('hex');
    // Create or update user with invite
    await pool.query(`
      INSERT INTO users (email, role, invite_token, landlord_id, invite_accepted)
      VALUES ($1, 'tenant', $2, $3, false)
      ON CONFLICT (email) DO UPDATE SET invite_token = $2, landlord_id = $3, invite_accepted = false
    `, [email, inviteToken, req.user.role === 'landlord' ? req.user.id : null]);
    const inviteLink = `${process.env.FRONTEND_URL || 'https://rental-management-system-1-07j5.onrender.com'}/accept-invite?token=${inviteToken}`;
    res.json({ inviteLink });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// (Keep existing POST for direct add, but add landlord check)
router.post('/', authenticate, role('admin', 'landlord'), async (req, res) => {
  const { name, email, password, unit_id } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  const userResult = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
    [name, email, hashed, 'tenant']
  );
  const tenantId = userResult.rows[0].id;
  if (unit_id) {
    // Ensure unit belongs to this landlord (if landlord)
    let query = 'UPDATE units SET is_occupied=true, current_tenant_id=$1 WHERE id=$2';
    const params = [tenantId, unit_id];
    if (req.user.role === 'landlord') {
      query += ' AND property_id IN (SELECT id FROM properties WHERE landlord_id=$3)';
      params.push(req.user.id);
    }
    await pool.query(query, params);
  }
  res.status(201).json({ id: tenantId, name, email });
});

module.exports = router;
