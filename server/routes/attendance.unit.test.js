const request = require('supertest');
const express = require('express');

// Mock Attendance and Log
jest.mock('../models/attendance', () => {
  const MockAttendance = jest.fn(function (doc) {
    Object.assign(this, doc);
    this.save = jest.fn(async () => {
      this.id = this.id || 'new-id-123';
      return this;
    });
  });

  MockAttendance.find = jest.fn();
  MockAttendance.findById = jest.fn();

  return MockAttendance;
});

jest.mock('../services/log', () => jest.fn());

const Attendance = require('../models/attendance');
const Log = require('../services/log');
const router = require('./attendance');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return app;
}

describe('Attendance routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('returns 200 with data when Attendance.find succeeds', async () => {
      const fakeData = [{ id: 'a1' }, { id: 'a2' }];
      Attendance.find.mockResolvedValueOnce(fakeData);

      const res = await request(makeApp()).get('/');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'OK', data: fakeData });
      expect(Attendance.find).toHaveBeenCalledTimes(1);
    });

    it('returns 500 when Attendance.find throws', async () => {
      Attendance.find.mockRejectedValueOnce(new Error('db down'));

      const res = await request(makeApp()).get('/');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: 'An unexpected error has occurred in processing the request.',
      });
    });
  });

  describe('POST / validation', () => {
    it('400 when missing fields (fails middleware)', async () => {
      // missing classId/date/takenBy
      const res = await request(makeApp()).post('/').send({ uin: 'u123' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'invalid param' });
      expect(Attendance.findById).not.toHaveBeenCalled();
    });
  });

  describe('POST / create', () => {
    it('201 creates new attendance and logs', async () => {
      const body = {
        uin: '12345678',
        classId: '09222024',
        date: '2024-02-09T07:40:17.469Z',
        takenBy: 'user1234'
      };

      const res = await request(makeApp()).post('/').send(body);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('attendance taken');
      const saved = res.body.data;
      expect(saved.uin).toBe('12345678');
      expect(saved.classId).toBe('09222024');
      expect(saved.date).toBe('2024-02-09T07:40:17.469Z');
      expect(saved.takenBy).toBe('user1234');

      // log
      const [loggedId, msg] = Log.mock.calls[0];
      expect(loggedId).toBe(saved.id);
      expect(msg).toMatch(/create uin=12345678/);
      expect(msg).toMatch(/classId=09222024/);
      expect(msg).toMatch(/date=2024-02-09T07:40:17.469Z/);
      expect(msg).toMatch(/takenBy=user1234/);
    });

    it('500 if constructor save throws', async () => {
      Attendance.mockImplementationOnce(function (doc) {
        Object.assign(this, doc);
        this.save = jest.fn(async () => {
          throw new Error('save failed');
        });
      });

      const res = await request(makeApp()).post('/').send({
        uin: '12345678',
        classId: '09222024',
        date: '2024-02-09T07:40:17.469Z',
        takenBy: 'user1234'
      });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: 'An unexpected error has occurred in processing the request.',
      });
      expect(Log).not.toHaveBeenCalled();
    });
  });

  describe('POST / update', () => {
    it('200 updates only changed fields and logs changes', async () => {
      const existing = {
        id: '13579',
        uin: 'oldUin',
        classId: 'oldClassId',
        date: '2024-02-09T07:40:17.469Z',
        takenBy: 'oldTakenBy',
        save: jest.fn(async function () {
          return this;
        }),
      };

      Attendance.findById.mockResolvedValueOnce(existing);

      const res = await request(makeApp())
        .post('/')
        .send({
          id: '13579',
          uin: 'newUin',                      // changed
          classId: 'oldClassId',
          date: '2025-08-30T07:40:17.469Z',   // changed
          takenBy: 'oldTakenBy',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('attendance updated');

      const updated = res.body.data;
      expect(updated.uin).toBe('newUin');                       // changed
      expect(updated.classId).toBe('oldClassId');               // unchanged
      expect(updated.date).toBe('2025-08-30T07:40:17.469Z');    // changed
      expect(updated.takenBy).toBe('oldTakenBy');               // unchanged

      // log
      const [idArg, msgArg] = Log.mock.calls[0];
      expect(idArg).toBe('13579');
      expect(msgArg).toMatch(/^update /);
      expect(msgArg).toMatch(/uin=newUin/);
      expect(msgArg).toMatch(/date=2025-08-30T07:40:17.469Z/);
      expect(msgArg).not.toMatch(/classId=/);
      expect(msgArg).not.toMatch(/takenBy/);
    });

    it('500 if findById throws', async () => {
      Attendance.findById.mockRejectedValueOnce(new Error('db fail'));

      const res = await request(makeApp())
        .post('/')
        .send({
          id: '13579',
          uin: 'u1',
          classId: 'c1',
          date: '2025-08-30T07:40:17.469Z',
          takenBy: 't1',
        });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: 'An unexpected error has occurred in processing the request.',
      });
      expect(Log).not.toHaveBeenCalled();
    });

    it('500 if saving updated doc throws', async () => {
      const existing = {
        id: '97531',
        uin: 'x',
        classId: 'y',
        date: '2025-08-30T07:40:17.469Z',
        takenBy: 'z',
        save: jest.fn(async () => {
          throw new Error('save err');
        }),
      };
      Attendance.findById.mockResolvedValueOnce(existing);

      const res = await request(makeApp())
        .post('/')
        .send({
          id: '97531',
          uin: 'x2',
          classId: 'y',
          date: '2025-08-31T07:40:17.469Z',
          takenBy: 'z',
        });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: 'An unexpected error has occurred in processing the request.',
      });
      expect(Log).not.toHaveBeenCalled();
    });
  });
});
