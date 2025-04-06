const db = require('../database');

exports.createClient = async (req, res) => {
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
};

exports.getAllClients = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM clientes ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar clientes", detalhes: err });
  }
}

