import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [path.join(__dirname, '../modules/**/entities/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '../database/migrations/*.{ts,js}')],

  synchronize: false, // Always false in production
  migrationsRun: true,
  logging: false,
};
