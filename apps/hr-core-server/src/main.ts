import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as compression from 'compression';

import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { UserModule } from './modules/user/user.module';
import { OwnerModule } from './modules/owner/owner.module';
import { AppModule } from './app/app.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomValidationPipe } from '@kafaat-systems/exceptions';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // We don't need to register the global exception filter here
    // as it's registered in the ExceptionsModule using APP_FILTER
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security
  app.use(helmet());

  // Performance
  app.use(compression());

  // Validation - Using our custom validation pipe that throws ValidationException
  app.useGlobalPipes(new CustomValidationPipe());

  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // API documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('HR Core API')
      .setDescription('API for HR Core SaaS application')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      include: [UserModule, AuthModule, OwnerModule],
    });
    SwaggerModule.setup('docs', app, document);
  }

  // Set global prefix
  app.setGlobalPrefix('api');

  // Start server
  const port = process.env.BE_PORT || 3000;
  await app.listen(port, '0.0.0.0');

  Logger.log(`Environment: ${process.env.NODE_ENV}`);
  Logger.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  Logger.log(`Default schema: ${process.env.DEFAULT_SCHEMA}`);
  Logger.log(`Application is running on: http://localhost:${port}/api`);
  Logger.log(`Swagger documentation: http://localhost:${port}/docs`);
}

bootstrap();
