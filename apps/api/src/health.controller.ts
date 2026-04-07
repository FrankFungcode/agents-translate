import { Controller, Get } from '@nestjs/common';

@Controller('api/health')
export class HealthController {
  @Get()
  health() {
    return {
      ok: true,
      service: 'agents-translate-api',
      timestamp: new Date().toISOString(),
    };
  }
}
