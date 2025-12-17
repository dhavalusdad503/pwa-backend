import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Entities } from './entities';
import { IDbOptions } from '@common/types';
import { parseInt } from '@common/utils';

const DB_PORT = 5432;
const MAX_POOL_SIZE = 100;
// const CONNECTION_TIMEOUT_MILLIS = 1000;

export const generateDataSourceOptions = (
  options?: IDbOptions,
): DataSourceOptions => {
  const dataSource: DataSourceOptions = {
    type: 'postgres',
    host: options?.host ?? process.env?.DB_HOST ?? 'localhost',
    port: parseInt(options?.port ?? process.env?.DB_PORT) ?? DB_PORT,
    username: options?.username ?? process.env?.DB_USER ?? 'postgres',
    password: options?.password ?? process.env?.DB_PASSWORD ?? 'postgres',
    database: options?.name ?? process.env?.DB_NAME ?? 'users_db',
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
    logging: true,
    migrationsRun: false,
    entities: [...Entities],
    migrations: [__dirname + '/../../database/migrations/*{.ts,.js}'],
    extra: {
      // based on  https://node-postgres.com/api/pool
      // max connection pool size
      max: MAX_POOL_SIZE,
      // connection timeout
      // connectionTimeoutMillis: CONNECTION_TIMEOUT_MILLIS,
    },
    ssl:
      process.env.NODE_ENV === 'development'
        ? false
        : { rejectUnauthorized: false },
  };
  return dataSource;
};

const AppDataSource = new DataSource(generateDataSourceOptions());
export default AppDataSource;
