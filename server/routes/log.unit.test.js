const request = require('supertest');
const express = require('express');

// Mock Log
jest.mock('../models/log', () => {
  const MockLog = {};
  MockLog.find = jest.fn();
  return MockLog;
});
const Log = require('../models/log');
const router = require('./log');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return app;
}

describe('Log routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('returns 200 and data when Log.find succeeds', async () => {
      const fakeData = [{ id: '24680', message: 'hi' }];
      Log.find.mockResolvedValueOnce(fakeData);

      const res = await request(makeApp()).get('/');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'OK', data: fakeData });
    });

    it('returns 500 when Log.find throws', async () => {
      Log.find.mockRejectedValueOnce(new Error('db error'));

      const res = await request(makeApp()).get('/');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: 'An unexpected error has occurred in processing the request.',
      });
    });
  });
});
