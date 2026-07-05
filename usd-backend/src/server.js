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

// [CORRIGÉ] Liste des origines autorisées - Assure-toi que c'est bien ton URL Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'https://usd-projet-final.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true
}));

// Gestion explicite des requêtes OPTIONS (pré-vol)
app.options('*', cors());

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
// 2. LOGGING & DEBUG
// ==========================================
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Logue l'origine de chaque requête pour debugger le CORS
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url} | Origin: ${req.get('origin')}`);
  next();
});

// Dossier public
app.use('/uploads', express.static('uploads'));

// Documentation Swagger
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route de santé
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API opérationnelle' });
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
// 4. GESTION DES ERREURS
// ==========================================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `La route ${req.originalUrl} n'existe pas.`
  });
});

app.use((err, req, res, next) => {
  console.error("🔴 [ERREUR FATALE] :", err.stack);
  res.status(500).json({
    success: false,
    message: "Une erreur interne s'est produite.",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ==========================================
// 5. DÉMARRAGE
// ==========================================
// IMPORTANT: Railway injecte le port, ne pas forcer 5000 en prod
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 [SERVER] Démarrage de l'API USD.Pro`);
  console.log(`📡 [PORT] En écoute sur le port ${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);