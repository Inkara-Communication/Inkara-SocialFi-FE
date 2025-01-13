'use client';

import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { AUTH_TOKEN } from '@/constant';
import { refresh } from '@/apis/auth';

//-----------------------------------------------------------------------------------------------

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    return Date.now() >= decodedToken.exp * 1000;
  } catch (error) {
    console.error(error);
    return true;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = React.useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN) : null
  );

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem(AUTH_TOKEN, newToken);
    } else {
      localStorage.removeItem(AUTH_TOKEN);
    }
  };

  React.useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const expiresInMs = decodedToken.exp * 1000 - Date.now();

      if (expiresInMs >= 10 * 1000) {
        const timeoutId = setTimeout(
          async () => {
            try {
              await refresh();
              const accessToken = localStorage.getItem(AUTH_TOKEN);
              setToken(accessToken);
            } catch (error) {
              console.error('Auto-refresh token failed', error);
              window.location.href = '/login';
            }
          },
          expiresInMs - 10 * 1000
        );

        return () => clearTimeout(timeoutId);
      }
    }
  }, [token]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(AUTH_TOKEN);
      if (storedToken !== token) {
        setTokenState(storedToken);
      }
    }
  }, [token]);

  const isAuthenticated = !!token && !isTokenExpired(token);
  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
