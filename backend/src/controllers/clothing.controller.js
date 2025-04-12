const db = require('../database');

exports.getAllClothings = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM clothings ORDER BY id DESC");
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar peças", detalhes: err });
    }
};

exports.createClothing = async (req, res) => {
    const { name, price, queue_name, purchase_channel, purchase_type, discount } = req.body;

    const totalPrice = discount ? price - discount : price;

    try {
        const result = await db.query(
            "INSERT INTO clothings (name, price, queue_name, purchase_channel, purchase_type, discount, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
            [name, price, queue_name, purchase_channel, purchase_type, discount, totalPrice]
        );
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao cadastrar peça", detalhes: err });
    }
};

exports.editClothing = async (req, res) => {
    const { id } = req.params;
    const { name, price, queue_name, purchase_channel, purchase_type, discount } = req.body;

    const totalPrice = discount ? price - discount : price;

    try {
        const result = await db.query(
            `UPDATE clothings 
            SET name = $1, price = $2, queue_name = $3, purchase_channel = $4, purchase_type = $5, discount = $6, total_price = $7
            WHERE id = $8 RETURNING *`,
            [name, price, queue_name, purchase_channel, purchase_type, discount, totalPrice, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ erro: "Peça não encontrada" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao editar peça", detalhes: err });
    }
};

exports.deleteClothing = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query("DELETE FROM clothings WHERE id = $1 RETURNING id", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ erro: "Peça não encontrada" });
        }

        res.status(200).json({ message: "Peça deletada com sucesso", id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao deletar peça", detalhes: err });
    }
};
