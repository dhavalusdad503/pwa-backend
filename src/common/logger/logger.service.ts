import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { join } from 'path';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export function createWinstonLogger(context: string): winston.Logger {
  const configService = new ConfigService();
  const logDir = join(
    process.cwd(),
    configService.get('logs_dir') ?? process.env.LOG_DIR ?? 'logs',
  );

  const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.label({ label: context }),
    winston.format.metadata({
      fillExcept: ['message', 'level', 'timestamp', 'label'],
    }),
    winston.format.json(),
  );

  const consoleFormat = winston.format.combine(
    winston.format.splat(),
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((info) => {
      const timestamp = info.timestamp as string;
      const level = info.level;
      const message = info.message as string;
      const label = info.label as string;

      return `${timestamp} ${level} [${label}]: ${message}`;
    }),
  );

  return winston.createLogger({
    format: fileFormat,
    transports: [
      new DailyRotateFile({
        level: 'debug',
        dirname: `${logDir}/debug`,
        filename: '%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '30d',
        json: false,
        zippedArchive: true,
      }),
      new DailyRotateFile({
        level: 'error',
        dirname: `${logDir}/error`,
        filename: '%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '30d',
        handleExceptions: true,
        json: false,
        zippedArchive: true,
      }),
      new winston.transports.Console({
        format: consoleFormat,
      }),
    ],
  });
}
