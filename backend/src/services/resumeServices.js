// SERVICE: TO HANDLE BUSINESS LOGIC FOR RESUME RELATED OPERATIONS
import Resume from '../models/Resume.js';

export const getAllResumes = async () => {
  return Resume.find({});
};

export const createResume = async (resumeData) => {
  return Resume.create(resumeData);
};

// Business logic to get all resumes from the database
// This is a placeholder for actual database interaction
