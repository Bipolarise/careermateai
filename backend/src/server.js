import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

// env: environment variables
// process.env, need to do to it because different environments have different values
// environment: local, development, production
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
