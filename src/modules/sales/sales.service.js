import pool from '../../config/db.js';

export const createOrder = async (userId, items) => {
  // On emprunte un client exclusif au pool pour la transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN'); // Début de la transaction sécurisée

    let totalAmount = 0;
    const orderItemsData = [];

    // 1. Vérification des prix réels et des stocks (Sécurité : on ne fait jamais confiance au prix envoyé par le Frontend)
    for (const item of items) {
      const res = await client.query('SELECT price, currency_code, stock_quantity FROM products WHERE id = $1 AND is_active = true', [item.productId]);
      const product = res.rows[0];

      if (!product) throw new Error(`Produit ${item.productId} introuvable ou inactif`);
      if (product.stock_quantity < item.quantity) throw new Error(`Stock insuffisant pour le produit ${item.productId}`);

      // On calcule le total côté serveur
      totalAmount += product.price * item.quantity;
      
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        currencyCode: product.currency_code
      });
    }

    // On suppose pour l'instant que tous les produits d'une commande ont la même devise
    const orderCurrency = orderItemsData[0].currencyCode;

    // 2. Création de la commande principale
    const orderRes = await client.query(
      'INSERT INTO orders (user_id, total_amount, currency_code, status) VALUES ($1, $2, $3, $4) RETURNING id, status, created_at',
      [userId, totalAmount, orderCurrency, 'PENDING']
    );
    const order = orderRes.rows[0];

    // 3. Insertion des lignes de commande ET mise à jour des stocks
    for (const item of orderItemsData) {
      // Ligne de commande
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [order.id, item.productId, item.quantity, item.unitPrice]
      );
      // Déduction du stock
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }

    await client.query('COMMIT'); // On valide tout !
    return { ...order, totalAmount, items: orderItemsData };

  } catch (error) {
    await client.query('ROLLBACK'); // En cas d'erreur, on annule tout
    throw error;
  } finally {
    client.release(); // On rend le client au pool
  }
};

export const getUserOrders = async (userId) => {
  const query = `
    SELECT o.id, o.total_amount, o.currency_code, o.status, o.created_at,
           json_agg(json_build_object(
             'productId', oi.product_id,
             'quantity', oi.quantity,
             'unitPrice', oi.unit_price,
             'name', pt.name
           )) as items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN product_translations pt ON oi.product_id = pt.product_id AND pt.language_code = 'fr'
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getAllOrders = async () => {
  const query = `
    SELECT o.id, o.total_amount, o.currency_code, o.status, o.created_at,
           u.first_name, u.last_name, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const updateOrderStatus = async (id, status) => {
  const query = `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`;
  const result = await pool.query(query, [status, id]);
  return result.rows[0];
};
