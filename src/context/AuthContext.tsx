import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, rank?: string, clearance?: string) => Promise<boolean>;
  logout: () => void;
  updateUserScore: (scoreToAdd: number, caseId?: string) => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cib_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const savedToken = localStorage.getItem('cib_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem('cib_token');
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to verify token', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || 'Access Denied: Invalid Agent Credentials');
        setIsLoading(false);
        return false;
      }

      const data = await res.json();
      localStorage.setItem('cib_token', data.token);
      setToken(data.token);
      setUser(data);
      setIsLoading(false);
      return true;
    } catch {
      setError('Connection to CIB Central Database failed');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (username: string, password: string, rank?: string, clearance?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rank, clearanceLevel: clearance })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || 'Registration failed');
        setIsLoading(false);
        return false;
      }

      const data = await res.json();
      localStorage.setItem('cib_token', data.token);
      setToken(data.token);
      setUser(data);
      setIsLoading(false);
      return true;
    } catch {
      setError('Connection to CIB Central Database failed');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('cib_token');
    setToken(null);
    setUser(null);
  };

  const updateUserScore = (scoreToAdd: number, caseId?: string) => {
    if (!user) return;
    const updatedCases = caseId && !user.completedCaseIds.includes(caseId)
      ? [...user.completedCaseIds, caseId]
      : user.completedCaseIds;

    setUser({
      ...user,
      score: user.score + scoreToAdd,
      completedCaseIds: updatedCases
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUserScore, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
