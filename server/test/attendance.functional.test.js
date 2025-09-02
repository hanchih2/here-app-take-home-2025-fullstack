const request = require('supertest');
const mongoose = require('mongoose');

const Attendance = require('../models/attendance');
const LogModel = require('../models/log');
const attendanceRouter = require('../routes/attendance');

function mount() {
  const express = require('express');
  const app = express();
  app.use(express.json());
  app.use('/', attendanceRouter);
  return app;
}

describe('Attendance (functional)', () => {
  it('GET / returns empty initially', async () => {
    const app = mount();
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'OK', data: [] });
  });

  it('POST / validation 400', async () => {
    const app = mount();
    const res = await request(app).post('/').send({ uin: 'u1' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'invalid param' });
  });

  it('POST / creates new attendance (201) and writes a log entry', async () => {
    const app = mount();
    const payload = {
      uin: 'u123',
      classId: 'c100',
      date: new Date('2025-08-30T00:00:00.000Z'),
      takenBy: 'TA-1',
    };

    const res = await request(app).post('/').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('attendance taken');

    // check attendance exists
    const all = await Attendance.find().lean();
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject(payload);

    // check log was written
    const logs = await LogModel.find().lean();
    expect(logs.length).toBe(1);
    expect(logs[0].message).toMatch(/create uin=u123/);
  });

  it('POST / updates existing attendance (200) and logs changed fields only', async () => {
    const existing = await Attendance.create({
      uin: 'oldU',
      classId: 'K001',
      date: '2025-08-01T00:00:00.000Z',
      takenBy: 'oldT',
    });

    const app = mount();
    const res = await request(app).post('/').send({
      id: existing.id,
      uin: 'newU',          // changed
      classId: 'K001',      // unchanged
      date: '2025-08-30T00:00:00.000Z',   // changed
      takenBy: 'oldT',      // unchanged
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('attendance updated');

    // confirm DB updates
    const updated = await Attendance.findById(existing.id).lean();
    expect(updated.uin).toBe('newU');
    expect(updated.classId).toBe('K001');
    expect(updated.date).toEqual(new Date('2025-08-30T00:00:00.000Z'));
    expect(updated.takenBy).toBe('oldT');

    // confirm log side-effect
    const logs = await LogModel.find().sort({ createdAt: 1 }).lean();
    expect(logs.length).toBe(1);
    expect(logs[0].attendanceId).toBe(existing.id);
    expect(logs[0].message).toMatch(/^update /);
    expect(logs[0].message).toMatch(/uin=newU/);
    expect(logs[0].message).toMatch(/date=2025-08-30T00:00:00.000Z/);
    expect(logs[0].message).not.toMatch(/classId=/);
    expect(logs[0].message).not.toMatch(/takenBy/);
  });

  it('GET / returns list after inserts', async () => {
    await Attendance.create([
      { uin: 'a', classId: 'c1', date: '2025-08-01T00:00:00.000Z', takenBy: 't' },
      { uin: 'b', classId: 'c1', date: '2025-08-02T00:00:00.000Z', takenBy: 't' },
    ]);
    const app = mount();
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('returns 500 when DB is unavailable', async () => {
    // Disconnect to force an error 
    await mongoose.disconnect();

    const app = mount();
    const res = await request(app).get('/');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: 'An unexpected error has occurred in processing the request.',
    });

    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
    await mongoose.connect(uri, { dbName: 'testdb', serverSelectionTimeoutMS: 10000 });
  });
});
