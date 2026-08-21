import request from 'supertest'; // lets us fire real HTTP requests at the Express app without binding a port
import app from '../../src/app.js'; // the actual Express app (routes + middleware), not a mock, so the test exercises real request handling
import { UserBuilder } from '../builders/user.builder.js'; // builder that produces valid Resume test data so each test doesn't hand-roll objects

describe('auth endpoint', () => {
  describe('POST /api/register', () => {
    it('register a new user', async () => {
      // create a new user, using a builder
      const user = new UserBuilder()
        .withEmail('asdf@fef.com')
        .withFullName('John Doe')
        .withPassword('password123')
        .build();

      // call the endpoint
      const response = await request(app).post('/api/register').send(user).expect(201);
      // check the endpoint is return the data that we needed
      expect(response.body.email).toEqual(user.email);
      expect(response.body.fullName).toEqual(user.name);
      expect(response.body.password).toBeUndefined(); // make sure the passowrd does not return to the client
    });
  });
});
