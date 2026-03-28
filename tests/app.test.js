import request from 'supertest';
import app from '../src/app.js';

describe('API Endpoints ', () => {
  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/health').expect(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/api').expect(200);
      expect(response.body).toHaveProperty('message', 'API is running');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 Not Found', async () => {
      const response = await request(app).get('/nonexistent').expect(404);
      expect(response.body).toHaveProperty('message', 'Route not found');
    });
  });
});
