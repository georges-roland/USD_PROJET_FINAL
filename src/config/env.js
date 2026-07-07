import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL variable d'environnement manquante.");
}

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_secret'
};
