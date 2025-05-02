const { sql } = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await sql`
      SELECT id, username, password_hash 
      FROM admin 
      WHERE username = ${username}
    `;

    if (result.length === 0) {
      return res.status(401).json({ message: 'Administrador não encontrado.' });
    }

    const admin = result[0];
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { adminId: admin.id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({
      role: 'admin',
      adminId: admin.id,
      username: admin.username,
      token
    });
  } catch (err) {
    console.error('Erro no login do admin:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

exports.login = async (req, res) => {
  const { phone } = req.body;
  try {
    const result = await sql`
      SELECT id, name 
      FROM clients 
      WHERE phone = ${phone}
    `;
    
    if (result.length === 0) {
      return res.status(401).json({ message: 'Phone not found.' });
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
