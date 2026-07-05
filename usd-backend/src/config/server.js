import app from './app.js';
import { env } from './config/env.js';
import { testDbConnection } from './config/db.js';

const startServer = async () => {
  await testDbConnection(); // C'est cette ligne qui fait le test !
  const server = app.listen(env.port, () => {
    console.log(`[SERVER] Serveur haut de gamme démarré avec succès sur le port ${env.port} en mode [${env.nodeEnv}]`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`[CRITICAL ERROR] Arrêt du serveur suite à une promesse non gérée : ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();