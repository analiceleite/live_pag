const { sql } = require('../../config/database');

exports.getAllMinings = async (req, res) => {
  try {
    const result = await sql`SELECT * FROM mining ORDER BY id DESC`;
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching mining records:', error);
    return res.status(500).json({ error: 'Error fetching mining records', details: error.message });
  }
};

exports.createMining = async (req, res) => {
  const { quantity, total_value, notes } = req.body;  

  if (quantity <= 0 || total_value <= 0) {
    return res.status(400).json({ error: 'Quantity and value must be greater than 0' });
  }

  try {
    const result = await sql`
      INSERT INTO mining (quantity, total_value, notes) 
      VALUES (${quantity}, ${total_value}, ${notes}) 
      RETURNING *
    `;
    return res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating mining record:', error);
    return res.status(500).json({ error: 'Error creating mining record', details: error.message });
  }
};

exports.editMining = async (req, res) => {
  const { id } = req.params;
  const { quantity, total_value, notes } = req.body;

  if (quantity <= 0 || total_value <= 0) {
    return res.status(400).json({ error: 'Quantity and value must be greater than 0' });
  }

  try {
    const result = await sql`
      UPDATE mining 
      SET quantity = ${quantity}, 
          total_value = ${total_value}, 
          notes = ${notes} 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Mining record not found' });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error updating mining record:', error);
    return res.status(500).json({ error: 'Error updating mining record', details: error.message });
  }
};

exports.deleteMining = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`
      DELETE FROM mining 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Mining record not found' });
    }

    return res.status(200).json({ message: 'Mining record deleted successfully' });
  } catch (error) {
    console.error('Error deleting mining record:', error);
    return res.status(500).json({ error: 'Error deleting mining record', details: error.message });
  }
};
