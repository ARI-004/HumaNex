import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET || "humanex_secret_jwt_key_2026_super_secure",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  // MySQL Configuration (Cloud or Local)
  MYSQL_URL: process.env.MYSQL_URL || process.env.DATABASE_URL,
  DB_HOST: process.env.MYSQL_HOST || process.env.DB_HOST || "localhost",
  DB_USER: process.env.MYSQL_USER || process.env.DB_USER || "root",
  DB_PASSWORD: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "",
  DB_NAME: process.env.MYSQL_DATABASE || process.env.DB_NAME || "humanex_db",
  DB_PORT: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  DB_SSL: process.env.MYSQL_SSL || process.env.DB_SSL || "false",
};
