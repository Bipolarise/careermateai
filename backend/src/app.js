import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/apiRoutes.js';
import jdRoutes from './routes/jdRoutes.js';
import ragRoutes from './routes/ragRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();

app.use(
  helmet({
    // API-only server: no HTML views are rendered, so a default CSP would
    // only add noise without protecting anything (no inline scripts/styles served).
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-site' },
  }),
); // set security-related HTTP headers
app.use(cors()); // will explain later on
app.use(express.json()); // will explain later on
app.use('/api', apiLimiter); // rate limit all API routes

app.use('/api', authRoutes); // create the routes ()
app.use('/api', resumeRoutes); // create the routes for resumes
app.use('/api', jdRoutes); // create the routes for job descriptions
app.use('/api', ragRoutes); // create the routes for RAG (retrieval-augmented generation)

app.use(errorHandler); // Catch any errors

export default app;
