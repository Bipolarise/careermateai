import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearToken,
  getToken,
  getUserFromToken,
  isTokenValid,
  setToken,
  type AuthTokenPayload,
} from '../utils/token';

type AuthContextValue = {
  token: string | null;
  user: AuthTokenPayload | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: (token: string) => void;
  logout: () => void;
};

// Responsibility: single source of truth for the logged-in user's token/info, shared across pages
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  useEffect(() => {
    if (token && !isTokenValid(token)) {
      clearToken();
      setTokenState(null);
    }
  }, [token]);

  const isAuthenticated = isTokenValid(token);
  const user = isAuthenticated ? getUserFromToken(token) : null;

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: isAuthenticated ? token : null,
      user,
      isAuthenticated,
      hasCompletedOnboarding: Boolean(user?.role && user?.field && user?.goal),
      login,
      logout,
    }),
    [token, user, isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
