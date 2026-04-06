const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  process.exit(1);
}

console.log('✅ Connecting to database...');
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'tenant',
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        total_units INT DEFAULT 0,
        image_url TEXT,
        landlord_id INT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS units (
        id SERIAL PRIMARY KEY,
        property_id INT,
        unit_number VARCHAR(10) NOT NULL,
        rent_amount DECIMAL(10,2),
        is_occupied BOOLEAN DEFAULT false,
        current_tenant_id INT
      );
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        tenant_id INT,
        unit_id INT,
        amount DECIMAL(10,2) NOT NULL,
        due_date DATE NOT NULL,
        paid_date DATE,
        status VARCHAR(20) DEFAULT 'pending',
        mpesa_receipt VARCHAR(100),
        mpesa_checkout_id VARCHAR(100)
      );
      CREATE TABLE IF NOT EXISTS maintenance_requests (
        id SERIAL PRIMARY KEY,
        tenant_id INT,
        unit_id INT,
        description TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'submitted'
      );
    `);
    console.log('✅ Migrations applied successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
