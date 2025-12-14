import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { PostgresDriverError } from '../interface/error.interface';

@Catch()
export class AllExceptionFilter implements ExceptionFilter<unknown> {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    response.status(status).json({
      success: false,
      message,
      // path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getStatus(error: unknown): HttpStatus {
    if (error instanceof HttpException) {
      return error.getStatus();
    }

    if (error instanceof QueryFailedError) {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(error: unknown): string {
    // ---------- TYPEORM ----------
    if (error instanceof QueryFailedError) {
      const driverError: PostgresDriverError | undefined =
        this.extractDriverError(error as QueryFailedError);

      if (!driverError) {
        return 'Database error';
      }

      switch (driverError.code) {
        case '23505':
          return this.formatUniqueError(driverError);

        case '23503':
          return 'Foreign key constraint violation';

        case '23502':
          return driverError.column
            ? `Column '${driverError.column}' cannot be null`
            : 'Required column cannot be null';

        default:
          return driverError.detail ?? 'Database error';
      }
    }

    // ---------- HTTP ----------
    if (error instanceof HttpException) {
      const response = error.getResponse();

      if (typeof response === 'string') {
        return response;
      }

      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const msg = (response as { message?: string | string[] }).message;
        return Array.isArray(msg) ? msg.join(', ') : (msg ?? error.message);
      }

      return error.message;
    }

    // ---------- GENERIC ----------
    if (error instanceof Error) {
      return error.message;
    }

    return 'Internal server error';
  }

  private extractDriverError(
    error: QueryFailedError,
  ): PostgresDriverError | undefined {
    if (typeof error.driverError === 'object' && error.driverError !== null) {
      return error.driverError as PostgresDriverError;
    }
    return undefined;
  }

  private formatUniqueError(error: PostgresDriverError): string {
    if (!error.detail) {
      return 'Duplicate value exists';
    }

    return error.detail.replace(
      /Key \((.*?)\)=\((.*?)\)/,
      (_: string, field: string, value: string) =>
        `${this.capitalize(field)} '${value}' already exists`,
    );
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
