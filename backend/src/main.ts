import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const clientUrls = [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:5173',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || clientUrls.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in development
      }
    },
    credentials: true,
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // Mount a simple health check outside /api if needed
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/health', (req: any, res: any) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);
  logger.log(`🚀 NestJS Invoicer Backend running on http://localhost:${port}/api`);
}

bootstrap();
