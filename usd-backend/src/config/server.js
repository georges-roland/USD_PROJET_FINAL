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
// 1. SÉCURITÉ & CORS
// ==========================================
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());

const allowedOrigins = [
  'http://localhost:5173',
  'https://usd-projet-final.vercel.app',
  'https://usd-projet-final-d6epedaip-epole-georges-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked: Origin not allowed'));
    }
  },
  credentials: true
}));

app.options('*', cors()); 

app.use(express.json());
app.use(cookieParser());

// ==========================================
// 2. MIDDLEWARES
// ==========================================
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ==========================================
// 3. ROUTES
// ==========================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.get('/api/v1/health', (req, res) => res.status(200).json({ status: 'OK' }));

// ==========================================
// 4. GESTION DES ERREURS & DÉMARRAGE
// ==========================================
app.use('*', (req, res) => res.status(404).json({ message: "Route inexistante." }));

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`🚀 Serveur actif sur port ${PORT}`));

process.on('SIGTERM', () => server.close(() => pool.end()));