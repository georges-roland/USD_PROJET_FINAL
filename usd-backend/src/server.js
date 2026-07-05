import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import pool from './config/db.js';

// Imports des routes
import authRoutes from './modules/auth/auth.routes.js';
import catalogRoutes from './modules/catalog/catalog.routes.js';
import salesRoutes from './modules/sales/sales.routes.js';
import supportRoutes from './modules/support/support.routes.js';
import statsRoutes from './modules/stats/stats.routes.js';
import paymentRoutes from './modules/payments/payment.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==========================================
// 1. MIDDLEWARES DE SÉCURITÉ & PERFORMANCES
// ==========================================
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Limiteur de requêtes global
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Trop de requêtes, veuillez ralentir." }
});
app.use('/api/', apiLimiter);

// ==========================================
// 2. LOGGING INDUSTRIEL (MORGAN)
// ==========================================
// Affiche dans le terminal un log propre pour chaque requête
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Dossier public pour les images
app.use('/uploads', express.static('uploads'));

// Documentation Swagger
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: "USD Pro API Documentation"
}));

// Route de santé
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// ==========================================
// 3. ROUTES DE L'API
// ==========================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/payments', paymentRoutes);

// ==========================================
// 4. GESTION DES ERREURS (CATCH-ALL)
// ==========================================

// Intercepte les routes qui n'existent pas (Erreur 404)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `La route ${req.originalUrl} n'existe pas sur ce serveur.`
  });
});

// Middleware Global de traitement des erreurs (Évite le crash fatal)
app.use((err, req, res, next) => {
  console.error("🔴 [ERREUR FATALE] :", err.stack);
  res.status(500).json({
    success: false,
    message: "Une erreur interne critique s'est produite.",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ==========================================
// 5. DÉMARRAGE ET GRACEFUL SHUTDOWN
// ==========================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 [SERVER] Démarrage de l'API USD.Pro`);
  console.log(`📡 [PORT] En écoute sur le port ${PORT}`);
  console.log(`🛡️  [SECURITY] Helmet & RateLimiter activés`);
  console.log(`📊 [LOGS] Morgan logger activé\n`);
});

// Gestion de la fermeture propre du serveur
const shutdown = async () => {
  console.log('\n🛑 [SHUTDOWN] Signal de fermeture reçu. Extinction en cours...');
  server.close(async () => {
    console.log('💤 [SERVER] Serveur HTTP fermé.');
    try {
      await pool.end(); // Ferme les connexions à PostgreSQL
      console.log('🐘 [DATABASE] Pool PostgreSQL fermé proprement.');
      process.exit(0);
    } catch (err) {
      console.error('🔴 [DATABASE] Erreur lors de la fermeture :', err);
      process.exit(1);
    }
  });
};

// Écoute des signaux d'arrêt (Ctrl+C, etc.)
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
