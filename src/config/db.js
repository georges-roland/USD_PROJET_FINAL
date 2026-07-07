import pkg from 'pg';
const { Pool } = pkg;
import { env } from './env.js';

const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err, client) => {
  console.error('[CRITICAL] Erreur inattendue sur un client PostgreSQL inactif', err);
  process.exit(-1);
});

export const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() AS current_time');
    console.log(`[DATABASE] Connexion réussie à PostgreSQL. Heure du serveur DB: ${res.rows[0].current_time}`);
    
    // Auto-migration to support admin chat replies
    await client.query("ALTER TABLE support_messages ADD COLUMN IF NOT EXISTS sender VARCHAR(50) DEFAULT 'client'");
    
    client.release();
  } catch (err) {
    console.error('[DATABASE] Échec de la connexion à la base de données:', err.message);
    process.exit(1);
  }
};

export default pool;
