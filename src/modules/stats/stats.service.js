import pool from '../../config/db.js';

export const getDashboardMetrics = async () => {
  const metrics = {
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0
  };

  const revenueRes = await pool.query(`SELECT SUM(total_amount) as total FROM orders WHERE status != 'CANCELLED'`);
  // Correction : Parser la somme de total_amount en entier (car pg renvoie les sommes sous forme de chaîne de caractères)
  metrics.totalRevenue = parseInt(revenueRes.rows[0].total, 10) || 0;

  const pendingRes = await pool.query(`SELECT COUNT(*) as count FROM orders WHERE status = 'PENDING'`);
  metrics.pendingOrders = parseInt(pendingRes.rows[0].count, 10);

  const productsRes = await pool.query(`SELECT COUNT(*) as count FROM products`);
  metrics.totalProducts = parseInt(productsRes.rows[0].count, 10);

  return metrics;
};
