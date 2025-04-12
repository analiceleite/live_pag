const db = require('../database');

exports.getAllPaymentMethods = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM payment_method ORDER BY name');
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao recuperar os métodos de pagamento:', error);
        return res.status(500).json({ message: 'Erro ao recuperar os métodos de pagamento.' });
    }
};

exports.getActivePaymentMethod = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM payment_method WHERE active = true LIMIT 1');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Nenhum método de pagamento ativo encontrado.' });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao recuperar o método de pagamento ativo:', error);
        return res.status(500).json({ message: 'Erro ao recuperar o método de pagamento ativo.' });
    }
};

exports.setActivePaymentMethod = async (req, res) => {
    const { name } = req.body;

    try {
        await db.query('UPDATE payment_method SET active = false');
        
        const result = await db.query(
            'UPDATE payment_method SET active = true WHERE name = $1 RETURNING *',
            [name]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Método de pagamento não encontrado.' });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao ativar o método de pagamento:', error);
        return res.status(500).json({ message: 'Erro ao ativar o método de pagamento.' });
    }
};

