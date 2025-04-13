const db = require('../database');

exports.createPurchase = async (req, res) => {
  const { client_id, clothings } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO purchases (client_id) VALUES ($1) RETURNING id",
      [client_id]
    );

    const purchaseId = result.rows[0].id;

    const insertPurchaseClothings = clothings.map(c =>
      db.query(
        "INSERT INTO purchase_clothings (purchase_id, clothing_id) VALUES ($1, $2)",
        [purchaseId, c]
      )
    );

    await Promise.all(insertPurchaseClothings);

    res.status(201).json({ purchase_id: purchaseId });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Payment
exports.getAllPendencies = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.id AS purchase_id, p.created_at, p.is_paid, p.is_delivery_asked, p.is_delivery_sent,
              c.cpf, c.name AS client, cl.name AS clothing, cl.price, pm.name AS payment_method
       FROM purchases p
       JOIN clients c ON p.client_id = c.id
       JOIN purchase_clothings pc ON p.id = pc.purchase_id
       JOIN clothings cl ON cl.id = pc.clothing_id
       LEFT JOIN payment_method pm ON p.payment_method_id = pm.id
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getPendenciesByClient = async (req, res) => {
  const { clientId } = req.params;

  try {
    const result = await db.query(
      `SELECT p.id AS purchase_id, p.created_at, p.is_paid, p.is_delivery_asked, c.cpf, c.name AS client,
              cl.name AS clothing, cl.price, pm.name AS payment_method
       FROM purchases p
       JOIN clients c ON p.client_id = c.id
       JOIN purchase_clothings pc ON p.id = pc.purchase_id
       JOIN clothings cl ON cl.id = pc.clothing_id
       LEFT JOIN payment_method pm ON p.payment_method_id = pm.id
       WHERE c.id = $1
       ORDER BY p.created_at DESC`,
      [clientId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error while fetching client pendencies', details: err });
  }
};

exports.markAsPaid = async (req, res) => {
  const { purchaseId } = req.params;
  const { payment_method_id } = req.body;

  try {
    const result = await db.query(
      "UPDATE purchases SET is_paid = TRUE, payment_method_id = $1 WHERE id = $2 RETURNING *",
      [payment_method_id, purchaseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }

    res.status(200).json({ message: 'Compra marcada como paga' });
  } catch (err) {
    console.error('Erro ao marcar como paga:', err);
    res.status(500).json({ message: 'Erro ao marcar como paga', error: err });
  }
};

exports.markAsUnpaid = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    await db.query(
      'UPDATE purchases SET is_paid = false, payment_method_id = NULL WHERE id = $1',
      [purchaseId]
    );
    res.json({ message: 'Compra marcada como não paga com sucesso' });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delivery
exports.markAsDeliveryRequested = (req, res) => {
  const { purchaseId } = req.params;

  db.query('UPDATE purchases SET is_delivery_asked = TRUE WHERE id = $1', [purchaseId])
    .then(result => {
      res.status(200).json({ message: 'Entrega solicitada com sucesso' });
    })
    .catch(error => {
      res.status(500).json({ message: 'Erro ao solicitar entrega', error });
    });
};

exports.getAllDeliveriesRequested = (req, res) => {
  db.query(`
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
  `)
    .then(result => {
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Nenhuma entrega solicitada encontrada' });
      }
      res.status(200).json(result.rows);
    })
    .catch(error => {
      console.error('Erro ao carregar entregas solicitadas:', error);
      res.status(500).json({ message: 'Erro ao carregar entregas solicitadas', error });
    });
};

exports.markAsSent = (req, res) => {
  const { purchaseId } = req.params;

  db.query('UPDATE purchases SET is_delivery_sent = TRUE WHERE id = $1 RETURNING *', [purchaseId])
    .then(result => {
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Compra não encontrada' });
      }
      res.status(200).json({ message: 'Entrega marcada como enviada' });
    })
    .catch(error => {
      console.error('Erro ao marcar como enviada:', error);
      res.status(500).json({ message: 'Erro ao marcar como enviada', error });
    });
};

exports.markAsNotSent = (req, res) => {
  const { purchaseId } = req.params;

  db.query('UPDATE purchases SET is_delivery_sent = FALSE WHERE id = $1 RETURNING *', [purchaseId])
    .then(result => {
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Compra não encontrada' });
      }
      res.status(200).json({ message: 'Envio desfeito' });
    })
    .catch(error => {
      console.error('Erro ao desfazer envio:', error);
      res.status(500).json({ message: 'Erro ao desfazer envio', error });
    });
};


