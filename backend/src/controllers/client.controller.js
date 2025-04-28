const { sql } = require('../../config/database');

exports.getAllClients = async (req, res) => {
  try {
    const result = await sql`SELECT * FROM clients ORDER BY id DESC`;
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: "Error fetching clients", details: err.message });
  }
};

exports.createClient = async (req, res) => {
  const {
    name,
    cpf,
    instagram,
    phone,
    zip_code,
    address,
    reference_point
  } = req.body;

  try {
    const result = await sql`
      INSERT INTO clients (
        name, cpf, instagram, phone, zip_code, address, reference_point
      ) VALUES (
        ${name}, ${cpf}, ${instagram}, ${phone}, ${zip_code}, ${address}, ${reference_point}
      )
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({ error: "Error creating client", details: err.message });
  }
};

exports.editClient = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    cpf,
    instagram,
    phone,
    zip_code,
    address,
    reference_point
  } = req.body;

  try {
    await sql`
      UPDATE clients SET
        name = ${name},
        cpf = ${cpf},
        instagram = ${instagram},
        phone = ${phone},
        zip_code = ${zip_code},
        address = ${address},
        reference_point = ${reference_point}
       WHERE id = ${id}
    `;

    res.status(200).json({ message: "Client updated successfully!" });
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).json({ error: "Error updating client", details: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const checkClient = await sql`SELECT id FROM clients WHERE id = ${id}`;
    
    if (checkClient.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    await sql`DELETE FROM clients WHERE id = ${id}`;
    res.status(200).json({ message: "Client deleted successfully!" });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ error: "Error deleting client", details: err.message });
  }
};
