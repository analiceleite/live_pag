const db = require('../database');

exports.login = async (req, res) => {
  const { cpf } = req.body;
  try {
    const result = await db.query(
      "SELECT id, nome FROM clientes WHERE cpf = $1", [cpf]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'CPF não encontrado' });
    } else {
      const cliente = result.rows[0];
      res.json({
        role: 'usuario',
        clienteId: cliente.id,
        nome: cliente.nome
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
