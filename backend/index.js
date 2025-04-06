// backend/index.js

const express = require("express");
const { Pool } = require('pg');
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o PostgreSQL
const db = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT
});

// Middleware para autenticação
function auth(role) {
  return (req, res, next) => {
    const userRole = req.headers['x-role'];
    if (userRole !== role) return res.status(403).json({ message: 'Access denied' });
    next();
  };
}

// Middleware para obter o usuário atual
function getUser(req) {
  const role = req.headers['x-role'];
  return users.find(u => u.role === role);
}

// Login do usuário com CPF
app.post("/login", async (req, res) => {
  const { cpf } = req.body;

  try {
    const result = await db.query("SELECT id, nome FROM clientes WHERE cpf = $1", [cpf]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'CPF não encontrado' });
    }

    const cliente = result.rows[0];
    res.json({
      role: 'usuario',
      clienteId: cliente.id,
      nome: cliente.nome
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADMIN: Adiciona cliente com CPF
app.post("/clientes", auth('admin'), async (req, res) => {
  const { nome, cpf } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO clientes (nome, cpf) VALUES ($1, $2) RETURNING id",
      [nome, cpf]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json(err);
  }
});


// ADMIN: Adiciona peça
app.post("/pecas", auth('admin'), async (req, res) => {
  const { nome, preco } = req.body;
  try {
    const result = await db.query("INSERT INTO pecas (nome, preco) VALUES ($1, $2) RETURNING id", [nome, preco]);
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADMIN: Cria compra com peças
app.post("/compras", auth('admin'), async (req, res) => {
  const { cliente_id, pecas } = req.body;
  try {
    const result = await db.query("INSERT INTO compras (cliente_id) VALUES ($1) RETURNING id", [cliente_id]);
    const compraId = result.rows[0].id;

    const insertCompraPeca = pecas.map(p => db.query(
      "INSERT INTO compra_pecas (compra_id, peca_id) VALUES ($1, $2)",
      [compraId, p]
    ));

    await Promise.all(insertCompraPeca);
    res.status(201).json({ compraId });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADMIN: Visualiza todas as compras de todos os clientes
app.get("/admin/pendencias", auth('admin'), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.id AS compra_id, c.data, cl.cpf, cl.nome AS cliente, p.nome AS peca, p.preco
       FROM compras c
       JOIN clientes cl ON c.cliente_id = cl.id
       JOIN compra_pecas cp ON c.id = cp.compra_id
       JOIN pecas p ON p.id = cp.peca_id
       ORDER BY c.data DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADMIN: Lista todas as peças cadastradas
app.get("/pecas", auth('admin'), async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM pecas ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar peças", detalhes: err });
  }
});

// ADMIN: Lista todos os clientes cadastrados
app.get("/clientes", auth('admin'), async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM clientes ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar clientes", detalhes: err });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});
