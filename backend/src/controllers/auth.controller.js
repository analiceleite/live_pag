const db = require('../database');

exports.login = async (req, res) => {
  const { cpf } = req.body;
  try {
    const result = await db.query(
      "SELECT id, name FROM clients WHERE cpf = $1", [cpf]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'CPF not found.' });
    } else {
      const client = result.rows[0];
      res.json({
        role: 'user',
        clientId: client.id,
        name: client.name
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
