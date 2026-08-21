// CONTROLLER PURPOSE: TO HANDLE THE REQUEST AND RESPONSE FOR RESUME RELATED ENDPOINTS (TRANFORMING DATA)
import * as resumeService from '../services/resumeServices.js';

// GET ALL RESUME
export const index = async (req, res) => {
  const resumes = await resumeService.getAllResumes(); // Call the service function to get all resumes
  res.json(resumes);
};

// GET ONE RESUME
export const show = (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

// CREATE RESUME
export const store = async (req, res) => {
  const resumeData = req.body; // Get the resume data from the request body
  const newResume = await resumeService.createResume(resumeData); // Call the service function to create a new resume
  res.status(201).json(newResume); // Respond with the newly created resume and a 201 status code
};

// UPDATE RESUME
export const update = (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

// DELETE RESUME
export const destroy = (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};
