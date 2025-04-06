const db = require('../database');

exports.createClothing = async (req, res) => {
    const { nome, preco } = req.body;
    try {
        const result = await db.query("INSERT INTO pecas (nome, preco) VALUES ($1, $2) RETURNING id", [nome, preco]);
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAllClothings = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM pecas ORDER BY id DESC");
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar peças", detalhes: err });
    }
}
