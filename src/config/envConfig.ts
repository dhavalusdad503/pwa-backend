import dotenv from "dotenv";

dotenv.config();

export const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET_KEY: process.env.JWT_SECRET || "your_jwt_secret",
  SECRET_KEY: process.env.SECRET_KEY || "your_secret_key",
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL || "",
  DATABASE_CONFIG: {
    HOST: process.env.DB_HOST || "localhost",
    PORT: Number(process.env.DB_PORT) || 5432,
    USER: process.env.DB_USER || "",
    PASSWORD: process.env.DB_PASSWORD || "",
    DB_NAME: process.env.DB_NAME || "",
  },
  MAIL_CONFIG: {
    HOST: process.env.SMTP_HOST || "",
    PORT: Number(process.env.SMTP_PORT) || 587,
    USER: process.env.SMTP_USER || "",
    PASSWORD: process.env.SMTP_PASSWORD || "",
    FROM_EMAIL: process.env.SMTP_FROM || "",
  },
  REDIS_CONFIG: {
    HOST: process.env.REDIS_HOST || "localhost",
    PORT: Number(process.env.REDIS_PORT) || 6379,
    USER: process.env.REDIS_USER || "",
    PASSWORD: process.env.REDIS_PASSWORD || "",
  },
};
