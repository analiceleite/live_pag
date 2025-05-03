const { sql } = require('../../config/database');

// Get available PIX keys
exports.getAvailablePixKeys = async (req, res) => {
    try {
        const pixKeys = await sql`
            SELECT * FROM pix_keys 
            WHERE active = true 
            ORDER BY main DESC, created_at DESC
        `;
        return res.json(pixKeys);
    } catch (err) {
        console.error('Error fetching available PIX keys:', err);
        return res.status(500).json({
            error: 'Error fetching available PIX keys',
            details: err.message
        });
    }
};

// Get all PIX keys
exports.getAllPixKeys = async (req, res) => {
    try {
        const pixKeys = await sql`
            SELECT * FROM pix_keys 
            ORDER BY main DESC, created_at DESC
        `;
        return res.json(pixKeys);
    } catch (err) {
        console.error('Error fetching PIX keys:', err);
        return res.status(500).json({
            error: 'Error fetching PIX keys',
            details: err.message
        });
    }
};

// Get PIX key by ID
exports.getPixKeyById = async (req, res) => {
    try {
        const [pixKey] = await sql`
            SELECT * FROM pix_keys WHERE id = ${req.params.id}
        `;

        if (!pixKey) {
            return res.status(404).json({ error: 'PIX key not found' });
        }

        return res.json(pixKey);
    } catch (err) {
        console.error('Error fetching PIX key:', err);
        return res.status(500).json({
            error: 'Error fetching PIX key',
            details: err.message
        });
    }
};

// Create new PIX key
exports.createPixKey = async (req, res) => {
    try {
        const { key, type, receptor_name, city, description, main = false } = req.body;

        // Basic validation
        if (!key || !type || !receptor_name || !city || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if key already exists
        const [existingKey] = await sql`
            SELECT id FROM pix_keys WHERE key = ${key}
        `;
        if (existingKey) {
            return res.status(400).json({ error: 'This PIX key is already registered' });
        }

        // If this will be the main key or if there's no main key yet
        let shouldBeMain = main;
        if (!main) {
            const [hasMainKey] = await sql`
                SELECT id FROM pix_keys WHERE main = true
            `;
            shouldBeMain = !hasMainKey;
        }

        const [newPixKey] = await sql`
            INSERT INTO pix_keys (
                key, type, receptor_name, city, description, main
            ) VALUES (
                ${key}, ${type}, ${receptor_name}, ${city}, ${description}, ${shouldBeMain}
            )
            RETURNING *
        `;

        return res.status(201).json({
            message: 'PIX key registered successfully',
            pixKey: newPixKey
        });
    } catch (err) {
        console.error('Error creating PIX key:', err);
        return res.status(500).json({
            error: 'Error creating PIX key',
            details: err.message
        });
    }
};

// Update PIX key
exports.updatePixKey = async (req, res) => {
    try {
        const { key, type, receptor_name, city, description, active, main } = req.body;

        if (!key || !type || !receptor_name || !city || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if key exists
        const [existingKey] = await sql`
            SELECT * FROM pix_keys WHERE id = ${req.params.id}
        `;
        if (!existingKey) {
            return res.status(404).json({ error: 'PIX key not found' });
        }

        // Check if new key already exists (if key was changed)
        if (key !== existingKey.key) {
            const [duplicateKey] = await sql`
                SELECT id FROM pix_keys WHERE key = ${key} AND id != ${req.params.id}
            `;
            if (duplicateKey) {
                return res.status(400).json({ error: 'This PIX key is already registered' });
            }
        }

        const [updatedPixKey] = await sql`
            UPDATE pix_keys SET
                key = ${key},
                type = ${type},
                receptor_name = ${receptor_name},
                city = ${city},
                description = ${description},
                active = ${active !== undefined ? active : existingKey.active},
                main = ${main !== undefined ? main : existingKey.main},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${req.params.id}
            RETURNING *
        `;

        return res.json({
            message: 'PIX key updated successfully',
            pixKey: updatedPixKey
        });
    } catch (err) {
        console.error('Error updating PIX key:', err);
        return res.status(500).json({
            error: 'Error updating PIX key',
            details: err.message
        });
    }
};

// Set PIX key as main
exports.setMainPixKey = async (req, res) => {
    try {
        const [pixKey] = await sql`
            UPDATE pix_keys 
            SET main = true, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${req.params.id}
            RETURNING *
        `;

        if (!pixKey) {
            return res.status(404).json({ error: 'PIX key not found' });
        }

        return res.json({
            message: 'PIX key set as main successfully',
            pixKey
        });
    } catch (err) {
        console.error('Error setting main PIX key:', err);
        return res.status(500).json({
            error: 'Error setting main PIX key',
            details: err.message
        });
    }
};

// Delete PIX key
exports.deletePixKey = async (req, res) => {
    try {
        // Check if key exists and is main
        const [pixKey] = await sql`
            SELECT * FROM pix_keys WHERE id = ${req.params.id}
        `;

        if (!pixKey) {
            return res.status(404).json({ error: 'PIX key not found' });
        }

        // Don't allow deleting the only main key
        if (pixKey.main) {
            const [{ count }] = await sql`
                SELECT COUNT(*) as count FROM pix_keys
            `;
            if (count === 1) {
                return res.status(400).json({
                    error: 'Cannot delete the only PIX key. Register another key first.'
                });
            }
        }

        await sql`
            DELETE FROM pix_keys WHERE id = ${req.params.id}
        `;

        // If deleted key was main, set another key as main
        if (pixKey.main) {
            await sql`
                UPDATE pix_keys 
                SET main = true 
                WHERE active = true 
                LIMIT 1
            `;
        }

        return res.json({ message: 'PIX key deleted successfully' });
    } catch (err) {
        console.error('Error deleting PIX key:', err);
        return res.status(500).json({
            error: 'Error deleting PIX key',
            details: err.message
        });
    }
};
