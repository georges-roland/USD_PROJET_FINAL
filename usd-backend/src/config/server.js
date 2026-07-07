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
// 1. SÉCURITÉ & CORS (CORRIGÉ)
// ==========================================
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());

// Configuration CORS flexible pour Vercel
const corsOptions = {
  origin: function (origin, callback) {
    // Autorise localhost pour le développement et tout domaine *.vercel.app pour la prod
    if (!origin || origin.startsWith('http://localhost') || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked: Origine non autorisée'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Gère les requêtes pré-vol

app.use(express.json());
app.use(cookieParser());

// ==========================================
// 2. LOGGING & MIDDLEWARES
// ==========================================
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ==========================================
// 3. ROUTES API
// ==========================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.get('/api/v1/health', (req, res) => res.status(200).json({ status: 'OK' }));

// ==========================================
// 4. GESTION DES ERREURS
// ==========================================
app.use('*', (req, res) => res.status(404).json({ message: "Route inexistante." }));

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`🚀 Serveur actif sur port ${PORT}`));

process.on('SIGTERM', () => server.close(() => pool.end()));