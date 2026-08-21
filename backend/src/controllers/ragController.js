// CONTROLLER PURPOSE: TO HANDLE THE REQUEST AND RESPONSE FOR RAG (RETRIEVAL-AUGMENTED GENERATION) RELATED ENDPOINTS
import * as ragService from '../services/ragService.js';

function validateQuestion(question) {
  if (!question || !question.trim()) {
    return 'Question is required';
  }
  return null;
}

// ASK A QUESTION (RAG)
export async function ask(req, res, next) {
  try {
    const { question } = req.body;

    const error = validateQuestion(question);
    if (error) {
      return res.status(400).json({ error });
    }

    const answer = await ragService.answerQuestion(question);
    return res.status(200).json({ question, answer });
  } catch (error) {
    return next(error);
  }
}
