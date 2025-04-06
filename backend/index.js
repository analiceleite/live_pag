// backend/index.js

const { Pool } = require('pg');
const express = require("express");
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

// ADMIN: PIX
app.post('/pix', async (req, res) => {
  const { valor } = req.body;

  try {
    const chavePix = '+5547997616421'; 
    const nomeRecebedor = 'ANALICE';
    const cidade = 'JOINVILLE';
    const valorFormatado = Number(valor).toFixed(2);
    const txid = 'LIVE';

    function formatField(id, value) {
      const size = String(value.length).padStart(2, '0');
      return `${id}${size}${value}`;
    }

    // Payload formatado conforme padrão do Banco Central
    const payloadSemCRC = [
      formatField('00', '01'), // Payload Format Indicator
      formatField('26', // Merchant Account Information
        formatField('00', 'BR.GOV.BCB.PIX') +
        formatField('01', chavePix)
      ),
      formatField('52', '0000'), // Merchant Category Code
      formatField('53', '986'), // Moeda: 986 = BRL
      formatField('54', valorFormatado), // Valor
      formatField('58', 'BR'), // País
      formatField('59', nomeRecebedor), // Nome do recebedor
      formatField('60', cidade), // Cidade
      formatField('62', // Adicional data
        formatField('05', txid)
      )
    ].join('');

    // Adiciona campo do CRC no final (com valor temporário)
    const payloadComCRCBase = payloadSemCRC + '6304';

    // Função para calcular CRC-16-CCITT
    function crc16(str) {
      let crc = 0xFFFF;
      for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
          if (crc & 0x8000) {
            crc = (crc << 1) ^ 0x1021;
          } else {
            crc <<= 1;
          }
        }
      }
      return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }

    const crc = crc16(payloadComCRCBase);
    const payloadFinal = payloadComCRCBase + crc;

    return res.json({ payload: payloadFinal });
  } catch (err) {
    console.error('Erro ao gerar Pix manual:', err);
    return res.status(500).json({ error: 'Erro ao gerar Pix manual' });
  }
});


app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});
