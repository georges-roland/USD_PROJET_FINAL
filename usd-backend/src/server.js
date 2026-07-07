import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import pool, { testDbConnection } from './config/db.js';

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
// 1. SÉCURITÉ & CORS
// ==========================================
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());

// Configuration CORS flexible pour Vercel et Railway
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    // Autorise localhost en développement et tout sous-domaine de Vercel/Railway en prod
    if (
      !origin || 
      origin.startsWith('http://localhost') || 
      origin.startsWith('http://127.0.0.1') || 
      origin.endsWith('.vercel.app') || 
      origin.endsWith('.railway.app') ||
      origin.endsWith('.up.railway.app') ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: Origine ${origin} non autorisée`));
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
// 2. LOGGING & MIDDLEWARES & STATICS
// ==========================================
app.use(morgan('dev'));

// S'assurer que le dossier uploads existe et l'exposer statiquement
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Swagger documentation
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

// ==========================================
// 5. CONNEXION BDD & DÉMARRAGE DU SERVEUR
// ==========================================
// Tester la connexion et exécuter les migrations automatiques au démarrage
testDbConnection();

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`🚀 Serveur actif sur port ${PORT}`));

process.on('SIGTERM', () => server.close(() => pool.end()));
