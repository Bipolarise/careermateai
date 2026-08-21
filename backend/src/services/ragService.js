// SERVICE: TO HANDLE BUSINESS LOGIC FOR RAG (RETRIEVAL-AUGMENTED GENERATION) RELATED OPERATIONS
import Anthropic from '@anthropic-ai/sdk';
import { pipeline, cos_sim as cosSim } from '@huggingface/transformers';

const anthropic = new Anthropic();

// Knowledge base — in a real app this would come from the database (e.g. an FAQ collection)
const documents = [
  'Refunds are processed within 5 business days of the return being received.',
  'Our API rate limit is 1000 requests per minute per API key.',
  'Support hours are 9am-6pm EST, Monday through Friday.',
  'We accept Visa, Mastercard, and PayPal for payment.',
];

// Lazy-load the embedding model once and reuse it across requests
let embedderPromise = null;
function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedderPromise;
}

async function embed(text) {
  const embedder = await getEmbedder();
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// Build the vector index once and cache it, instead of re-embedding the
// knowledge base on every request
let indexPromise = null;
function getIndex() {
  if (!indexPromise) {
    indexPromise = Promise.all(
      documents.map(async (text) => ({ text, vector: await embed(text) })),
    );
  }
  return indexPromise;
}

// index: [
//   {
//     text: 'Refunds are processed within 5 business days of the return being received.',
//     score: 0.95
//   },
// {
//     text: 'Support hours are 9am-6pm EST, Monday through Friday.',
//     score: 0.30
//   },

// qVector: [0.4]

export const retrieve = async (question, k = 2) => {
  // This is the answers with vector(score)
  const index = await getIndex();
  // This is the question with vector(score)
  const qVector = await embed(question);
  // calculate the highest scoring entries are returned as context for Claude.
  return index
    .map((entry) => ({ text: entry.text, score: cosSim(qVector, entry.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
};

export const answerQuestion = async (question) => {
  // Get all the most relevant answer to the question from the knowledge base(documents)
  const topChunks = await retrieve(question);

  const context = topChunks.map((chunk) => `- ${chunk.text}`).join('\n');

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    thinking: { type: 'adaptive' },
    messages: [
      {
        role: 'user',
        content: `Answer the question using only the context below. If the answer isn't in the context, say you don't know.

Context:
${context}

Question: ${question}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock?.text ?? '';
};
