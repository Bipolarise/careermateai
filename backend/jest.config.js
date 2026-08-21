export default {
  testEnvironment: 'node',
  transform: {},
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'], // shared DB connect/cleanup hooks for every test file
  coverageProvider: 'v8', // use Node's native V8 coverage since there's no Babel transform to instrument ESM with
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'], // only measure our own source, not tests/config; server.js is just the process entrypoint (starts listening), not app logic
  coverageDirectory: 'coverage', // where reports get written
  coverageReporters: ['text', 'html'], // 'text' prints a summary in the terminal, 'html' writes the browsable report
};
