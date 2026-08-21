// SERVICE: TO HANDLE BUSINESS LOGIC FOR JD (JOB DESCRIPTION) RELATED OPERATIONS
import Anthropic from '@anthropic-ai/sdk';
import JD from '../models/JD.js';

const anthropic = new Anthropic();

export const getJDsByUser = async (userId) => {
  return JD.find({ user: userId }).sort({ createdAt: -1 });
};

export const generateResumeFromJD = async (jobDescription, candidate) => {
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system:
      'You are a resume-writing assistant. Given a candidate profile and a job description, generate a tailored resume that highlights relevant skills and experience for that role. For the SUMMARY: introduce it with your own personal touch, highlighting key experiences. ' +
      'Also identify the hiring company name (if the job description names one) and the job role/title being hired for. ' +
      'Respond with ONLY valid JSON, no markdown fences, no commentary, in exactly this shape: {"companyName": string or null, "role": string, "resume": string}',
    messages: [
      {
        role: 'user',
        content: `Candidate profile:
Name: ${candidate.fullName ?? 'N/A'}
Role: ${candidate.role ?? 'N/A'}
Field: ${candidate.field ?? 'N/A'}
Goal: ${candidate.goal ?? 'N/A'}

Job description:
${jobDescription}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  const raw = textBlock?.text ?? '{}';

  try {
    return JSON.parse(raw);
  } catch {
    return { companyName: null, role: null, resume: raw };
  }
};

export const createJD = async (jdData, candidate) => {
  const { companyName, role, resume } = await generateResumeFromJD(
    jdData.jobDescription,
    candidate,
  );
  const title = [companyName, role].filter(Boolean).join(' - ') || 'Untitled Role';

  return JD.create({
    title,
    jobDescription: jdData.jobDescription,
    generatedResume: resume,
    user: candidate._id,
  });
};
