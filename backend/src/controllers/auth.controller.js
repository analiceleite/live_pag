const { sql } = require('../../config/database');

exports.login = async (req, res) => {
  const { cpf } = req.body;
  try {
    const result = await sql`
      SELECT id, name 
      FROM clients 
      WHERE cpf = ${cpf}
    `;
    
    if (result.length === 0) {
      return res.status(401).json({ message: 'CPF not found.' });
    }
    
    const client = result[0];
    res.json({
      role: 'user',
      clientId: client.id,
      name: client.name
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
