-- Tabela de clientes com novos campos
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14),
  instagram VARCHAR(100),
  telefone VARCHAR(20),
  cep VARCHAR(10),
  endereco TEXT,
  ponto_referencia TEXT
);

-- Tabela de peças
CREATE TABLE pecas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco NUMERIC(10, 2) NOT NULL
);

-- Tabela de compras
CREATE TABLE compras (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Relação entre compras e peças (muitos-para-muitos)
CREATE TABLE compra_pecas (
  compra_id INTEGER,
  peca_id INTEGER,
  FOREIGN KEY (compra_id) REFERENCES compras(id),
  FOREIGN KEY (peca_id) REFERENCES pecas(id)
);
