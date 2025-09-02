jest.setTimeout(120_000);

const mongoose = require('mongoose');

beforeAll(async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
  await mongoose.connect(uri, { dbName: 'testdb', serverSelectionTimeoutMS: 10000 });
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const k of Object.keys(collections)) await collections[k].deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});
