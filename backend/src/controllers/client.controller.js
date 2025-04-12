const db = require('../database');

exports.getAllClients = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM clients ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching clients", details: err });
  }
};

exports.createClient = async (req, res) => {
  const {
    name,
    cpf,
    instagram,
    phone,
    zipCode,
    address,
    reference_point
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO clients (name, cpf, instagram, phone, zip_code, address, reference_point)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [name, cpf, instagram, phone, zipCode, address, reference_point]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json(err);
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
    await db.query(
      `UPDATE clients SET
        name = $1,
        cpf = $2,
        instagram = $3,
        phone = $4,
        zip_code = $5,
        address = $6,
        reference_point = $7
       WHERE id = $8`,
      [name, cpf, instagram, phone, zip_code, address, reference_point, id]
    );

    res.status(200).json({ message: "Client updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error updating client", details: err });
  }
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM clients WHERE id = $1", [id]);
    res.status(200).json({ message: "Client deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting client", details: err });
  }
};
