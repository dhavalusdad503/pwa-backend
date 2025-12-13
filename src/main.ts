import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Remove unwanted fields
        forbidNonWhitelisted: true, // Throw error if unknown fields sent
        transform: true, // Auto-transform types
      }),
    );
    // app.useGlobalFilters(new AllExceptionsFilter());
    await app.listen(process.env.PORT ?? 3000, () => {
      console.log(
        `🚀 Server is running at http://localhost:${process.env.PORT}`,
      );
    });
  } catch (error) {
    console.log('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
