import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

/**
 * TG Labs Backend-for-Frontend. Every route is served under `/api`, which is
 * the prefix the gateway forwards to this service.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  const port = Number(process.env['PORT'] ?? 3000);
  await app.listen(port, '0.0.0.0');
  Logger.log(`BFF listening on http://0.0.0.0:${port}/api`, 'Bootstrap');
}

void bootstrap();
