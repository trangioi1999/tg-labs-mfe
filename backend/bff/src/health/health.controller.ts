import { Controller, Get } from '@nestjs/common';
import type { HealthStatus } from '@tg-labs/shared-models';

/** Liveness endpoint used by Docker health checks and the gateway. */
@Controller('health')
export class HealthController {
  @Get()
  check(): HealthStatus {
    return {
      status: 'ok',
      service: 'bff',
      version: process.env['APP_VERSION'] ?? 'dev',
      timestamp: new Date().toISOString(),
    };
  }
}
