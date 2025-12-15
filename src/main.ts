import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AppLogger } from './common/logger/app.logger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    // Enable CORS
    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Create Logger
    const logger = app.get(AppLogger);
    app.useLogger(logger);

    // Global Validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Remove unwanted fields
        forbidNonWhitelisted: true, // Throw error if unknown fields sent
        transform: true, // Auto-transform types
      }),
    );

    // Global Prefix all api starting with /api
    app.setGlobalPrefix('api');

    // Global Interceptors & Filters (response, exception)
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new AllExceptionFilter(logger));

    await app.listen(process.env.PORT ?? 3000, () => {
      logger.log(
        `🚀 Server is running at http://localhost:${process.env.PORT}`,
      );
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
