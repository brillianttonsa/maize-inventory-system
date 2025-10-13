CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


-- production
CREATE TABLE production_batches (
    id SERIAL PRIMARY KEY,
    batch_number VARCHAR(50) NOT NULL,
    maize_quantity INT NOT NULL,
    flour_output INT NOT NULL,
    bran_output INT NOT NULL,
    water_usage INT NOT NULL,
    electricity_usage INT NOT NULL,
    sacks_used INT NOT NULL,
    employee_notes TEXT,
    start_time TIME NOT NULL,
    end_time TIME,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);


-- procurement
CREATE TABLE procurement_orders (
    id SERIAL PRIMARY KEY,
    supplier VARCHAR(255) NOT NULL,
    quantity NUMERIC(12,2) NOT NULL,
    price_per_kg NUMERIC(12,2) NOT NULL,
    transport_cost NUMERIC(12,2) NOT NULL,
    total_cost NUMERIC(12,2) NOT NULL,
    delivery_date DATE NOT NULL,
    quality VARCHAR(20) NOT NULL DEFAULT 'high',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- sales
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_contact VARCHAR(50) NOT NULL,
  product_type VARCHAR(20) CHECK (product_type IN ('flour', 'bran')) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  price_per_kg DECIMAL(10, 2) NOT NULL,
  delivery_cost DECIMAL(10, 2) NOT NULL,
  delivery_address VARCHAR(255) NOT NULL,
  payment_method VARCHAR(30) CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money')) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  notes VARCHAR(200),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
