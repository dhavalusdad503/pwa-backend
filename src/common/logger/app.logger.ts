import { LoggerService } from '@nestjs/common';
import { Logger } from 'winston';
import { createWinstonLogger } from './logger.service';

export class AppLogger implements LoggerService {
  private readonly logger: Logger;

  constructor(private readonly context: string) {
    this.logger = createWinstonLogger(this.context);
  }

  log(message: string, meta?: unknown): void {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: unknown): void {
    if (meta instanceof Error) {
      this.logger.error(message, {
        message: meta.message,
        stack: meta.stack,
        name: meta.name,
      });
    } else {
      this.logger.error(message, meta);
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
