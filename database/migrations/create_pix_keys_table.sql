CREATE TABLE IF NOT EXISTS pix_keys (
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
