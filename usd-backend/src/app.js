import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';

// Import des routes
import authRoutes from './modules/auth/auth.routes.js';
import catalogRoutes from './modules/catalog/catalog.routes.js';
import salesRoutes from './modules/sales/sales.routes.js';
import supportRoutes from './modules/support/support.routes.js';
import statsRoutes from './modules/stats/stats.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. SÉCURITÉ : Cache les informations du serveur Express et configure COEP/COOP
app.use(helmet({ crossOriginResourcePolicy: false })); // false pour permettre le chargement des images externes

// 2. PERFORMANCE : Compresse les réponses JSON (Gzip) pour accélérer le réseau
app.use(compression());

// 3. SÉCURITÉ : Limite le nombre de requêtes pour éviter les attaques DDoS ou le Brute Force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: { success: false, message: "Trop de requêtes, veuillez réessayer plus tard." }
});
app.use('/api/', apiLimiter);

// Middlewares standards
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Servir le dossier uploads de manière statique (optimisé par la compression)
app.use('/uploads', express.static('uploads'));

// Swagger Documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: "USD Pro API Documentation"
}));

// Route de santé
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', environment: env.nodeEnv });
});

// Montage des routes métiers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/stats', statsRoutes);

export default app;
