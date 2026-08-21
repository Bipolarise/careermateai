import request from 'supertest'; // lets us fire real HTTP requests at the Express app without binding a port
import app from '../../src/app.js'; // the actual Express app (routes + middleware), not a mock, so the test exercises real request handling
import Resume from '../../src/models/Resume.js'; // used to seed/inspect the database directly, independent of the endpoint under test
import { ResumeBuilder } from '../builders/resume.builder.js'; // builder that produces valid Resume test data so each test doesn't hand-roll objects

// DB connect/cleanup for every test file is handled globally by tests/setup.js (see jest.config.js -> setupFilesAfterEnv)

describe('Resume endpoint', () => {
  // groups all tests related to the /api/resume endpoint
  describe('POST /api/resume', () => {
    // groups tests for the "create resume" action specifically
    it('creates a new resume and persists it to the database', async () => {
      // test case
      const resumePayload = new ResumeBuilder() // start from sensible default resume fields
        .withName('John Smith') // override name so we can assert on a known value later
        .withTitle('Backend Developer Resume') // override title for the same reason
        .build(); // produce the plain object to send as the request body

      const response = await request(app) // send the request through the real app (routes -> controller -> service -> model)
        .post('/api/resume') // hit the endpoint being tested
        .send(resumePayload) // request body the endpoint should save
        .expect(201); // endpoint should report "created"

      expect(response.body).toMatchObject(resumePayload); // response should echo back the data we sent (proves the controller/service aren't discarding it)
      expect(response.body._id).toBeDefined(); // Mongo should have assigned an id, proving it was actually saved

      const savedResume = await Resume.findById(response.body._id); // bypass the API and check the database directly
      expect(savedResume).not.toBeNull(); // confirms the document truly exists in the database, not just in the HTTP response
      expect(savedResume.name).toBe('John Smith'); // confirms the persisted data matches what was submitted
    });
  });

  describe('GET /api/resume', () => {
    // groups tests for the "list resumes" action specifically
    it('returns all resumes stored in the database', async () => {
      const resume1 = new ResumeBuilder().withName('Alice').build(); // first known record to seed the database with
      const resume2 = new ResumeBuilder().withName('Bob').build(); // second known record so we can check the list has multiple items
      await Resume.create([resume1, resume2]); // seed directly via the model, independent of the endpoint under test

      const response = await request(app) // call the endpoint being tested
        .get('/api/resume') // the list endpoint
        .expect(200); // should succeed

      expect(response.body).toHaveLength(2); // should return exactly the two seeded resumes, nothing more/less
      const names = response.body.map((resume) => resume.name); // extract names for an order-independent comparison
      expect(names).toEqual(expect.arrayContaining(['Alice', 'Bob'])); // confirms both seeded resumes were returned
    });
  });
});
