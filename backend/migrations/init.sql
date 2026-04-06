CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(255) UNIQUE, password_hash TEXT, role VARCHAR(20) DEFAULT 'tenant', created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE IF NOT EXISTS properties (id SERIAL PRIMARY KEY, name VARCHAR(255), address TEXT, total_units INT, image_url TEXT, landlord_id INT, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE IF NOT EXISTS units (id SERIAL PRIMARY KEY, property_id INT, unit_number VARCHAR(10), rent_amount DECIMAL(10,2), is_occupied BOOLEAN DEFAULT false, current_tenant_id INT);
CREATE TABLE IF NOT EXISTS payments (id SERIAL PRIMARY KEY, tenant_id INT, unit_id INT, amount DECIMAL(10,2), due_date DATE, paid_date DATE, status VARCHAR(20) DEFAULT 'pending', mpesa_receipt VARCHAR(100), mpesa_checkout_id VARCHAR(100));
CREATE TABLE IF NOT EXISTS maintenance_requests (id SERIAL PRIMARY KEY, tenant_id INT, unit_id INT, description TEXT, status VARCHAR(20) DEFAULT 'submitted');
