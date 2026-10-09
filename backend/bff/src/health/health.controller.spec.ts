import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('reports the service as healthy', () => {
    const result = new HealthController().check();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('bff');
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });
});
