import { basename, join } from 'path';
import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
import dotenv from "dotenv";

dotenv.config()

class Logger {
  private logger: winston.Logger;

  constructor() {
    const logDir = join(process.cwd(), process.env.LOG_DIR || 'logs');

    const fileLogFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.label({ label: basename(__filename || 'server') }),
      winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
      winston.format.json(),
    );

    const consoleLogFormat = winston.format.combine(
      winston.format.splat(),
      winston.format.colorize(),
      winston.format.printf((info) => {
        const { timestamp, level, message, label } = info;
        return `${timestamp} ${level} [${label}]: ${message}`;
      }),
    );

    this.logger = winston.createLogger({
      format: fileLogFormat,
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: `${logDir}/debug`,
          filename: '%DATE%.log',
          maxFiles: '30d',
          json: false,
          zippedArchive: true,
        }),
        new WinstonDaily({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: `${logDir}/error`,
          filename: '%DATE%.log',
          maxFiles: '30d',
          handleExceptions: true,
          json: false,
          zippedArchive: true,
        }),
        new winston.transports.Console({
          format: consoleLogFormat,
        }),
      ],
    });
  }

  public info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  public error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }

  public debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  public warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }
}

export default new Logger();
