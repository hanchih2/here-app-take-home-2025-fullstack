const request = require('supertest');
const express = require('express');
const Log = require('../models/log');
const logsRouter = require('../routes/log');
logsRouter.__name = 'logs';

function mount() {
  const app = express();
  app.use(express.json());
  app.use('/logs', logsRouter);
  return app;
}

describe('Logs (functional)', () => {
  it('GET / returns empty initially', async () => {
    const app = mount();
    const res = await request(app).get('/logs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'OK', data: [] });
  });

  it('GET / returns existing logs', async () => {
    await Log.create([
      { attendanceId: 'att-1', date: '2025-08-30T07:40:17.469Z', message: 'create uin=u1 classId=c1 date=... takenBy=...' },
      { attendanceId: 'att-1', date: '2025-08-30T07:40:17.469Z', message: 'update uin=u2' },
    ]);

    const app = mount();
    const res = await request(app).get('/logs');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toHaveProperty('message');
  });
});
