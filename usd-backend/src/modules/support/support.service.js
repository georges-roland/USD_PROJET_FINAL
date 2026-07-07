import pool from '../../config/db.js';

export const sendMessage = async (email, message, sender = 'client') => {
  try {
    const query = `INSERT INTO support_messages (email, message, sender) VALUES ($1, $2, $3) RETURNING *`;
    const res = await pool.query(query, [email, message, sender]);
    return res.rows[0];
  } catch (err) {
    // Self-healing: if sender column does not exist, run alter table and retry
    if (err.message.includes('column "sender" does not exist') || err.code === '42703') {
      try {
        await pool.query("ALTER TABLE support_messages ADD COLUMN IF NOT EXISTS sender VARCHAR(50) DEFAULT 'client'");
        const query = `INSERT INTO support_messages (email, message, sender) VALUES ($1, $2, $3) RETURNING *`;
        const res = await pool.query(query, [email, message, sender]);
        return res.rows[0];
      } catch (innerErr) {
        console.error('Failed to run self-healing support migration:', innerErr);
      }
    }
    // Final fallback: insert without sender column
    const fallbackQuery = `INSERT INTO support_messages (email, message) VALUES ($1, $2) RETURNING *`;
    const res = await pool.query(fallbackQuery, [email, message]);
    return res.rows[0];
  }
};

export const getMessages = async () => {
  const query = `SELECT * FROM support_messages ORDER BY created_at DESC`;
  const res = await pool.query(query);
  return res.rows;
};

export const getMyMessages = async (email) => {
  const query = `SELECT * FROM support_messages WHERE email = $1 ORDER BY created_at ASC`;
  const res = await pool.query(query, [email]);
  return res.rows;
};

export const markAsRead = async (id) => {
  await pool.query(`UPDATE support_messages SET is_read = TRUE WHERE id = $1`, [id]);
};
