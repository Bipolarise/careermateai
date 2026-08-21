type RegisterResponse = {
  message?: string;
  error?: string;
};

export async function registerUser(data: any): Promise<RegisterResponse> {
  const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const resultData: RegisterResponse = await response.json();

  if (!response.ok) {
    throw new Error(resultData.error ?? 'Registration failed');
  }

  return resultData;
}

export async function loginUser(data: any): Promise<any> {
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const resultData = await response.json();

  if (!response.ok) {
    throw new Error(resultData.error ?? 'Login failed');
  }

  return resultData;
}

export type OnboardingData = {
  role: string;
  field: string;
  goal: string;
};

export async function completeOnboarding(data: OnboardingData, token: string): Promise<any> {
  const response = await fetch('http://localhost:3000/api/onboarding', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const resultData = await response.json();

  if (!response.ok) {
    throw new Error(resultData.error ?? 'Onboarding failed');
  }

  return resultData;
}

export type ProfileData = {
  fullName: string;
  role: string;
  field: string;
  goal: string;
};

export async function updateProfile(data: ProfileData, token: string): Promise<any> {
  const response = await fetch('http://localhost:3000/api/profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const resultData = await response.json();

  if (!response.ok) {
    throw new Error(resultData.error ?? 'Failed to update settings');
  }

  return resultData;
}
