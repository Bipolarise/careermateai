// CONTROLLER PURPOSE: TO HANDLE THE REQUEST AND RESPONSE FOR JD (JOB DESCRIPTION) RELATED ENDPOINTS
import * as jdService from '../services/jdService.js';

function validateJobDescription(jobDescription) {
  if (!jobDescription || !jobDescription.trim()) {
    return 'Job description is required';
  }
  return null;
}

// GET ALL JDs FOR THE LOGGED-IN USER
export async function index(req, res, next) {
  try {
    const jds = await jdService.getJDsByUser(req.user._id);
    return res.status(200).json(jds);
  } catch (error) {
    return next(error);
  }
}

// CREATE JD FOR THE LOGGED-IN USER
export async function store(req, res, next) {
  try {
    const { jobDescription } = req.body;

    const error = validateJobDescription(jobDescription);
    if (error) {
      return res.status(400).json({ error });
    }

    const newJD = await jdService.createJD({ jobDescription }, req.user);
    return res.status(201).json(newJD);
  } catch (error) {
    return next(error);
  }
}
