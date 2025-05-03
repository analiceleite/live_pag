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

-- PIX Keys table
CREATE TABLE pix_keys (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CPF', 'CNPJ', 'EMAIL', 'TELEFONE', 'ALEATORIA')),
    receptor_name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    main BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to ensure only one main key
CREATE OR REPLACE FUNCTION update_pix_keys_main() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.main = true THEN
        UPDATE pix_keys SET main = false WHERE id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single main key
DROP TRIGGER IF EXISTS ensure_single_main_key ON pix_keys;
CREATE TRIGGER ensure_single_main_key
    BEFORE INSERT OR UPDATE ON pix_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_pix_keys_main();
