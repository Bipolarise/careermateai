import { jwtDecode, type JwtPayload } from 'jwt-decode';

const TOKEN_KEY = 'token';

export type AuthTokenPayload = JwtPayload & {
  fullName?: string;
  email?: string;
  role?: string;
  field?: string;
  goal?: string;
};

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getUserFromToken(token: string | null = getToken()): AuthTokenPayload | null {
  if (!token) return null;

  try {
    return jwtDecode<AuthTokenPayload>(token);
  } catch {
    return null;
  }
}
