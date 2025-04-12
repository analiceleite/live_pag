const db = require('../database'); 

exports.getAllMinings = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM mining');
    return res.status(200).json(result.rows); 
  } catch (error) {
    console.error('Erro ao recuperar os garimpos:', error);
    return res.status(500).json({ message: 'Erro ao recuperar os garimpos.' });
  }
};

exports.createMining = async (req, res) => {
  const { quantity, total_value, notes } = req.body;

  if (quantity <= 0 || total_value <= 0) {
    return res.status(400).json({ message: 'Quantidade e valor devem ser maiores que 0.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO mining (quantity, total_value, notes) VALUES ($1, $2, $3) RETURNING *',
      [quantity, total_value, notes]
    );
    return res.status(201).json(result.rows[0]); 
  } catch (error) {
    console.error('Erro ao cadastrar garimpo:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar o garimpo.' });
  }
};

exports.editMining = async (req, res) => {
  const { id } = req.params;
  const { quantity, total_value, notes } = req.body;

  if (quantity <= 0 || total_value <= 0) {
    return res.status(400).json({ message: 'Quantidade e valor devem ser maiores que 0.' });
  }

  try {
    const result = await db.query(
      'UPDATE mining SET quantity = $1, total_value = $2, notes = $3 WHERE id = $4 RETURNING *',
      [quantity, total_value, notes, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Garimpo não encontrado.' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao editar o garimpo:', error);
    return res.status(500).json({ message: 'Erro ao editar o garimpo.' });
  }
};

exports.deleteMining = async (req, res) => {
  const { id } = req.params; 

  try {
    const result = await db.query('DELETE FROM mining WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Garimpo não encontrado.' });
    }

    return res.status(200).json({ message: 'Garimpo excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir o garimpo:', error);
    return res.status(500).json({ message: 'Erro ao excluir o garimpo.' });
  }
};
