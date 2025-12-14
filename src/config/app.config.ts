import { parseInt } from '@/common/utils';

export const configStore = () => ({
  port: parseInt(process.env.PORT) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'app_db',
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  secretKey: process.env.SECRET_KEY || 'defaultSecretKey',
  frontendUrl: process.env.FRONTEND_URL || '',
  mail: {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || 'mail',
    password: process.env.SMTP_PASSWORD || 'password',
    from: process.env.SMTP_FROM || 'mail',
  },
  logs_dir: process.env.LOG_DIR || 'logs',
});
