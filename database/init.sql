-- Criação das tabelas

CREATE TABLE clients (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reference_point TEXT,
    address TEXT,
    zip_code VARCHAR,
    phone VARCHAR,
    instagram VARCHAR,
    cpf VARCHAR UNIQUE,
    name VARCHAR
);

CREATE TABLE payment_method (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE purchases (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_paid BOOLEAN DEFAULT FALSE,
    is_delivery_asked BOOLEAN DEFAULT FALSE,
    is_delivery_sent BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    tracking_code VARCHAR,
    client_id BIGINT REFERENCES clients(id),
    payment_method_id BIGINT REFERENCES payment_method(id)
);

CREATE TABLE clothings (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR,
    price NUMERIC,
    queue_name VARCHAR,
    purchase_channel VARCHAR,
    purchase_type VARCHAR,
    discount NUMERIC DEFAULT 0,
    total_price NUMERIC
);

CREATE TABLE purchase_clothings (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    purchase_id BIGINT REFERENCES purchases(id) ON DELETE CASCADE,
    clothing_id BIGINT REFERENCES clothings(id) ON DELETE CASCADE
);

CREATE TABLE mining (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    total_value NUMERIC,
    quantity INT
);
