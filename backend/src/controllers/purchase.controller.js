const db = require('../database');

exports.getAllPendencies = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.id AS purchase_id, p.created_at, p.is_paid, p.is_delivery_asked, p.is_delivery_sent, p.is_deleted,
              c.cpf, c.phone, c.name AS client, cl.name AS clothing, cl.price, pm.name AS payment_method
       FROM purchases p
       JOIN clients c ON p.client_id = c.id
       JOIN purchase_clothings pc ON p.id = pc.purchase_id
       JOIN clothings cl ON cl.id = pc.clothing_id
       LEFT JOIN payment_method pm ON p.payment_method_id = pm.id
       ORDER BY c.name, p.created_at DESC`
    );

    // Agrupar pendências por cliente
    const groupedPendencies = result.rows.reduce((acc, row) => {
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
        payment_method: row.payment_method
      });

      // Atualizar o total do cliente
      acc[clientKey].total_amount += parseFloat(row.price);

      return acc;
    }, {});

    // Converter o objeto agrupado em um array
    const response = Object.values(groupedPendencies);

    res.json(response);
  } catch (err) {
    console.error('Erro ao buscar pendências:', err);
    res.status(500).json({ error: 'Erro ao buscar pendências', details: err });
  }
};

exports.createPurchase = async (req, res) => {
  const { client_id, clothings } = req.body;

  try {
    // Verificar se a lista de peças está vazia
    if (!clothings || clothings.length === 0) {
      return res.status(400).json({ error: 'A lista de peças não pode estar vazia.' });
    }

    const purchaseIds = [];

    for (const clothing_id of clothings) {
      // Verificar se a peça já está associada a outra compra
      const clothingCheck = await db.query(
        "SELECT * FROM purchase_clothings WHERE clothing_id = $1",
        [clothing_id]
      );

      if (clothingCheck.rowCount > 0) {
        return res.status(400).json({ error: `A peça com ID ${clothing_id} já está associada a outra compra.` });
      }

      // Criar uma nova compra
      const result = await db.query(
        "INSERT INTO purchases (client_id) VALUES ($1) RETURNING id",
        [client_id]
      );

      const purchaseId = result.rows[0].id;

      // Adicionar a peça à compra
      await db.query(
        "INSERT INTO purchase_clothings (purchase_id, clothing_id) VALUES ($1, $2)",
        [purchaseId, clothing_id]
      );

      purchaseIds.push(purchaseId);
    }

    res.status(201).json({ purchase_ids: purchaseIds });
  } catch (err) {
    console.error('Erro ao criar compras:', err);
    res.status(500).json({ error: 'Erro ao registrar as compras', details: err });
  }
};

exports.markAsDeleted = async (req, res) => { 
  const { purchaseId } = req.params;

  try {
    const purchaseResult = await db.query(
      "SELECT * FROM purchases WHERE id = $1 AND is_deleted = false",
      [purchaseId]
    );

    if (purchaseResult.rowCount === 0) {
      return res.status(404).json({ message: 'Compra não encontrada ou já deletada' });
    }

    await db.query(
      "UPDATE purchases SET is_deleted = true WHERE id = $1",
      [purchaseId]
    );

    res.status(200).json({ message: 'Compra marcada como deletada com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar a compra:', err);
    res.status(500).json({ error: 'Erro ao deletar a compra', details: err });
  }
};

exports.markAsUndeleted = async (req, res) => { 
  const { purchaseId } = req.params;

  try {
    const purchaseResult = await db.query(
      "SELECT * FROM purchases WHERE id = $1",
      [purchaseId]
    );

    if (purchaseResult.rowCount === 0) {
      return res.status(404).json({ message: 'Compra não encontrada.' });
    }

    await db.query(
      "UPDATE purchases SET is_deleted = false WHERE id = $1",
      [purchaseId]
    );

    res.status(200).json({ message: 'Compra marcada como não deletada com sucesso' });
  } catch (err) {
    console.error('Erro ao desfazer deleção da compra:', err);
    res.status(500).json({ error: 'Erro ao desfazer deleção da compra', details: err });
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

// Payment
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


