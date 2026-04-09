require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Routes must be mounted BEFORE the catch-all
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/dashboard/stats', async (req, res) => {
  // ... (keep the previous working version) ...
  res.json({ totalRent: 0, pending: 0, occupied: 0, vacant: 0 });
});

// Root route for health check
app.get('/', (req, res) => res.send('Backend OK'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
