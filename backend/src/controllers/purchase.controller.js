const { sql } = require('../../config/database');

exports.getAllPendencies = async (req, res) => {
  try {
    const result = await sql`
      SELECT p.id AS purchase_id, 
             (p.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo')::date AS created_at, 
             p.is_paid, p.is_delivery_asked, p.tracking_code, p.is_delivery_sent, p.is_deleted,
             c.cpf, c.phone, c.name AS client, cl.name AS clothing, cl.price, pm.name AS payment_method
      FROM purchases p
      JOIN clients c ON p.client_id = c.id
      JOIN purchase_clothings pc ON p.id = pc.purchase_id
      JOIN clothings cl ON cl.id = pc.clothing_id
      LEFT JOIN payment_method pm ON p.payment_method_id = pm.id
      ORDER BY c.name, p.created_at DESC
    `;

    const groupedPendencies = result.reduce((acc, row) => {
      const clientKey = row.cpf; 

      if (!acc[clientKey]) {
        acc[clientKey] = {
          client: row.client,
          cpf: row.cpf,
          phone: row.phone,
          total_amount: 0,
          purchases: []
        };
      }

      // Adicionar a compra ao cliente
      acc[clientKey].purchases.push({
        purchase_id: row.purchase_id,
        created_at: row.created_at,
        is_paid: row.is_paid,
        is_delivery_asked: row.is_delivery_asked,
        is_delivery_sent: row.is_delivery_sent,
        is_deleted: row.is_deleted,
        clothing: row.clothing,
        price: parseFloat(row.price),
        payment_method: row.payment_method,
        tracking_code: row.tracking_code 
      });

      // Atualizar o total do cliente
      acc[clientKey].total_amount += parseFloat(row.price);

      return acc;
    }, {});

    // Converter o objeto agrupado em um array
    const response = Object.values(groupedPendencies);

    res.json(response);
  } catch (err) {
    console.error('Error fetching pendencies:', err);
    res.status(500).json({ error: 'Error fetching pendencies', details: err.message });
  }
};

exports.createPurchase = async (req, res) => {
  const { client_id, clothings } = req.body;

  try {
    // Verificar se a lista de peças está vazia
    if (!clothings?.length) {
      return res.status(400).json({ error: 'Clothing list cannot be empty' });
    }

    const purchaseIds = [];

    for (const clothing_id of clothings) {
      // Verificar se a peça já está associada a outra compra
      const clothingCheck = await sql`
        SELECT * FROM purchase_clothings WHERE clothing_id = ${clothing_id}
      `;

      if (clothingCheck.length > 0) {
        return res.status(400).json({ error: `Clothing ID ${clothing_id} is already associated with another purchase` });
      }

      // Criar uma nova compra
      const [newPurchase] = await sql`
        INSERT INTO purchases (client_id) VALUES (${client_id}) RETURNING id
      `;

      // Adicionar a peça à compra
      await sql`
        INSERT INTO purchase_clothings (purchase_id, clothing_id) VALUES (${newPurchase.id}, ${clothing_id})
      `;

      purchaseIds.push(newPurchase.id);
    }

    res.status(201).json({ purchase_ids: purchaseIds });
  } catch (err) {
    console.error('Error creating purchases:', err);
    res.status(500).json({ error: 'Error creating purchases', details: err.message });
  }
};

exports.markAsDeleted = async (req, res) => { 
  const { purchaseId } = req.params;

  try {
    const purchaseResult = await sql`
      SELECT * FROM purchases WHERE id = ${purchaseId}
    `;

    if (purchaseResult.length === 0) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    await sql`
      UPDATE purchases 
      SET is_deleted = true 
      WHERE id = ${purchaseId}
      RETURNING *
    `;

    res.status(200).json({ message: 'Purchase marked as deleted successfully' });
  } catch (err) {
    console.error('Error deleting purchase:', err);
    res.status(500).json({ error: 'Error deleting purchase', details: err.message });
  }
};

exports.markAsUndeleted = async (req, res) => { 
  const { purchaseId } = req.params;

  try {
    const purchaseResult = await sql`
      SELECT * FROM purchases WHERE id = ${purchaseId}
    `;

    if (purchaseResult.length === 0) {
      return res.status(404).json({ message: 'Purchase not found.' });
    }

    await sql`
      UPDATE purchases SET is_deleted = false WHERE id = ${purchaseId}
    `;

    res.status(200).json({ message: 'Purchase marked as not deleted successfully' });
  } catch (err) {
    console.error('Error restoring purchase deletion:', err);
    res.status(500).json({ error: 'Error restoring purchase deletion', details: err.message });
  }
};

exports.getPendenciesByClient = async (req, res) => {
  const { clientId } = req.params;

  try {
    const result = await sql`
      SELECT p.id AS purchase_id, p.created_at, p.is_paid, p.is_delivery_asked, p.tracking_code, c.cpf, c.name AS client,
              cl.name AS clothing, cl.price, pm.name AS payment_method
       FROM purchases p
       JOIN clients c ON p.client_id = c.id
       JOIN purchase_clothings pc ON p.id = pc.purchase_id
       JOIN clothings cl ON cl.id = pc.clothing_id
       LEFT JOIN payment_method pm ON p.payment_method_id = pm.id
       WHERE c.id = ${clientId}
       ORDER BY p.created_at DESC
    `;

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error while fetching client pendencies', details: err.message });
  }
};

// Payment
exports.markAsPaid = async (req, res) => {
  const { purchaseId } = req.params;
  const { payment_method_id } = req.body;

  try {
    const result = await sql`
      UPDATE purchases SET is_paid = TRUE, payment_method_id = ${payment_method_id} WHERE id = ${purchaseId} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    res.status(200).json({ message: 'Purchase marked as paid' });
  } catch (err) {
    console.error('Error marking as paid:', err);
    res.status(500).json({ message: 'Error marking as paid', error: err.message });
  }
};

exports.markAsUnpaid = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    await sql`
      UPDATE purchases SET is_paid = false, payment_method_id = NULL WHERE id = ${purchaseId}
    `;
    res.json({ message: 'Purchase marked as not paid successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delivery
exports.markAsDeliveryRequested = (req, res) => {
  const { purchaseId } = req.params;

  sql`
    UPDATE purchases SET is_delivery_asked = TRUE WHERE id = ${purchaseId}
  `
    .then(result => {
      res.status(200).json({ message: 'Delivery requested successfully' });
    })
    .catch(error => {
      res.status(500).json({ message: 'Error requesting delivery', error });
    });
};

exports.getAllDeliveriesRequested = (req, res) => {
  sql`
    SELECT 
      p.id AS purchase_id, 
      p.client_id, 
      p.is_delivery_asked, 
      p.is_delivery_sent, 
      p.created_at, 
      c.name AS client_name, 
      c.cpf AS client_cpf,
      SUM(cl.price) AS total_amount
    FROM purchases p
    JOIN clients c ON p.client_id = c.id
    JOIN purchase_clothings pc ON p.id = pc.purchase_id
    JOIN clothings cl ON pc.clothing_id = cl.id
    WHERE p.is_delivery_asked = TRUE
    GROUP BY p.id, p.client_id, p.is_delivery_asked, p.is_delivery_sent, p.created_at, c.name, c.cpf
  `
    .then(result => {
      if (result.length === 0) {
        return res.status(404).json({ message: 'No requested delivery found' });
      }
      res.status(200).json(result);
    })
    .catch(error => {
      console.error('Error loading requested deliveries:', error);
      res.status(500).json({ message: 'Error loading requested deliveries', error });
    });
};

exports.markAsSent = (req, res) => {
  const { purchaseId } = req.params;

  sql`
    UPDATE purchases SET is_delivery_sent = TRUE WHERE id = ${purchaseId} RETURNING *
  `
    .then(result => {
      if (result.length === 0) {
        return res.status(404).json({ message: 'Purchase not found' });
      }
      res.status(200).json({ message: 'Delivery marked as sent' });
    })
    .catch(error => {
      console.error('Error marking as sent:', error);
      res.status(500).json({ message: 'Error marking as sent', error });
    });
};

exports.markAsNotSent = (req, res) => {
  const { purchaseId } = req.params;

  sql`
    UPDATE purchases SET is_delivery_sent = FALSE WHERE id = ${purchaseId} RETURNING *
  `
    .then(result => {
      if (result.length === 0) {
        return res.status(404).json({ message: 'Purchase not found' });
      }
      res.status(200).json({ message: 'Sending undone' });
    })
    .catch(error => {
      console.error('Error undoing send:', error);
      res.status(500).json({ message: 'Error undoing send', error });
    });
};


// Tracking code
exports.updateTrackingCode = async (req, res) => {
  const { purchaseId } = req.params;
  const { tracking_code } = req.body;

  try {
    const result = await sql`
      UPDATE purchases 
      SET tracking_code = ${tracking_code} 
      WHERE id = ${purchaseId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.status(200).json({ message: 'Tracking code updated successfully' });
  } catch (err) {
    console.error('Error updating tracking code:', err);
    res.status(500).json({ error: 'Error updating tracking code', details: err.message });
  }
};


