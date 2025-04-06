const db = require('../database');

exports.createPurchase = async (req, res) => {
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
};

exports.getAllPendencies = async (req, res) => {
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
}
