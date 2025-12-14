import { LoggerService } from '@nestjs/common';
import { createWinstonLogger } from './logger.service';
import { Logger } from 'winston';

export class AppLogger implements LoggerService {
  private readonly logger: Logger;

  constructor(private readonly context: string) {
    this.logger = createWinstonLogger(this.context);
  }

  log(message: string, meta?: unknown): void {
    this.logger.info(message, meta);
  }

  error(message: string, error?: unknown): void {
    if (error instanceof Error) {
      this.logger.error(message, {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    } else {
      this.logger.error(message, { error });
    }
  }

  warn(message: string, meta?: unknown): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: unknown): void {
    this.logger.debug(message, meta);
  }

  verbose(message: string, meta?: unknown): void {
    this.logger.verbose(message, meta);
  }
}
