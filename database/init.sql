CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

CREATE TABLE pecas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco NUMERIC(10, 2) NOT NULL
);

CREATE TABLE compras (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE compra_pecas (
  compra_id INTEGER,
  peca_id INTEGER,
  FOREIGN KEY (compra_id) REFERENCES compras(id),
  FOREIGN KEY (peca_id) REFERENCES pecas(id)
);
