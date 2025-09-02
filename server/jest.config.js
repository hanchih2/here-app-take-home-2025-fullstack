module.exports = {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'node',
      testMatch: ['**/?(*.)+(unit).test.js'],
    },
    {
      displayName: 'functional',
      testEnvironment: 'node',
      testMatch: ['**/?(*.)+(functional).test.js'],
      setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
    },
  ],
};
