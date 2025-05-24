const { sql } = require('../../config/database');

exports.getAllClothings = async (req, res) => {
    try {
        const result = await sql`
            SELECT * FROM clothings 
            ORDER BY id DESC
        `;
        res.status(200).json(result);
    } catch (err) {
        console.error('Error in getAllClothings:', err);
        res.status(500).json({ error: "Error fetching clothing items", details: err.message });
    }
};

exports.getAvailableClothings = async (req, res) => {
    try {
        const result = await sql`
            SELECT * FROM clothings 
            WHERE id NOT IN (
                SELECT clothing_id FROM purchase_clothings
            )`;
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching available clothings:', err);
        res.status(500).json({ error: "Error fetching available clothing items", details: err.message });
    }
}

exports.createClothing = async (req, res) => {
    const { name, price, queue_name, purchase_channel, purchase_type, discount } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: "Name and price are required" });
    }

    const totalPrice = discount ? price - discount : price;

    try {
        const result = await sql`
            INSERT INTO clothings (
                name, price, queue_name, purchase_channel, 
                purchase_type, discount, total_price
            ) VALUES (
                ${name}, ${price}, ${queue_name}, ${purchase_channel}, 
                ${purchase_type}, ${discount}, ${totalPrice}
            ) 
            RETURNING id
        `;
        res.status(201).json({ id: result[0].id });
    } catch (err) {
        console.error('Error in createClothing:', err);
        res.status(500).json({ error: "Error creating clothing item", details: err.message });
    }
};

exports.editClothing = async (req, res) => {
    const { id } = req.params;
    const { name, price, queue_name, purchase_channel, purchase_type, discount } = req.body;

    const totalPrice = discount ? price - discount : price;

    try {
        const result = await sql`
            UPDATE clothings 
            SET name = ${name}, price = ${price}, queue_name = ${queue_name}, purchase_channel = ${purchase_channel}, purchase_type = ${purchase_type}, discount = ${discount}, total_price = ${totalPrice}
            WHERE id = ${id} 
            RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ error: "Clothing item not found" });
        }

        res.status(200).json(result[0]);
    } catch (err) {
        console.error('Error in editClothing:', err);
        res.status(500).json({ error: "Error updating clothing item", details: err.message });
    }
};

exports.deleteClothing = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await sql`
            DELETE FROM clothings 
            WHERE id = ${id} 
            RETURNING id
        `;

        if (result.length === 0) {
            return res.status(404).json({ error: "Clothing item not found" });
        }

        res.status(200).json({ message: "Clothing item deleted successfully", id: result[0].id });
    } catch (err) {
        console.error('Error in deleteClothing:', err);
        res.status(500).json({ error: "Error deleting clothing item", details: err.message });
    }
};

