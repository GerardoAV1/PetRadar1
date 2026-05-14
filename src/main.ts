/**
 * IMPORTANTE: setupApplicationInsights() debe llamarse ANTES de importar
 * AppModule para que el SDK instrumente correctamente Express, HTTP y la BD.
 */
import { setupApplicationInsights } from './telemetry/app-insights';
setupApplicationInsights();

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  // ValidationPipe removido - los DTOs no usan decoradores de class-validator
  // y whitelist:true descartaba todos los campos del body.

  await app.listen(envs.PORT);
  Logger.log(
    `PetRadar API corriendo en http://localhost:${envs.PORT}/api`,
    'Bootstrap',
  );
}
bootstrap();
