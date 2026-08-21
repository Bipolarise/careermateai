export type JD = {
  _id: string;
  title: string;
  jobDescription: string;
  generatedResume?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchMyJDs(token: string): Promise<JD[]> {
  const response = await fetch('http://localhost:3000/api/jd', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const resultData = await response.json();

  if (!response.ok) {
    throw new Error(resultData.error ?? 'Failed to load your resumes');
  }

  return resultData;
}

export async function submitJobDescription(jobDescription: string, token: string): Promise<JD> {
  const response = await fetch('http://localhost:3000/api/jd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jobDescription }),
  });

  const resultData = await response.json();

  if (!response.ok) {
    throw new Error(resultData.error ?? 'Failed to generate resume');
  }

  return resultData;
}
