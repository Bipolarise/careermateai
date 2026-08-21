// Global Jest setup, wired in via `setupFilesAfterEnv` in jest.config.js.
// Runs automatically for every test file, so individual test files don't
// need to manage the in-memory database connection themselves.

import mongoose from 'mongoose'; // needed to open/close the connection to the in-memory database
import { MongoMemoryServer } from 'mongodb-memory-server'; // spins up a real (but temporary, in-memory) MongoDB so tests don't touch the dev/prod database

// The User model encrypts PII (email) on save, which requires this to be set;
// tests don't load .env, so provide a fixed key so encryption/decryption is deterministic across a run.
process.env.ENCRYPTION_KEY ||= 'test-encryption-key-not-for-production';

let mongoServer; // holds the in-memory server instance so we can stop it later in afterAll

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(); // start a fresh in-memory MongoDB instance for this test file
  await mongoose.connect(mongoServer.getUri()); // point mongoose (and every model) at that in-memory instance
});

afterEach(async () => {
  const { collections } = mongoose.connection; // every collection backing a model used so far in this test file
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({})), // wipe each one so tests don't leak state into each other, regardless of which model(s) they use
  );
});

afterAll(async () => {
  await mongoose.disconnect(); // close the mongoose connection so Jest doesn't hang on an open handle
  await mongoServer.stop(); // shut down the in-memory MongoDB process to free resources
});
