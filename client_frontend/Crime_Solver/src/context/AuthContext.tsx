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
          // Check local user cache before dropping token
          const localUser = localStorage.getItem('cib_local_user');
          if (localUser) {
            setUser(JSON.parse(localUser));
          } else {
            localStorage.removeItem('cib_token');
            setToken(null);
          }
        }
      } catch {
        const localUser = localStorage.getItem('cib_local_user');
        if (localUser) {
          setUser(JSON.parse(localUser));
        }
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
      // Standalone Netlify Mode: Provide seamless local agent clearance
      const fallbackUser: UserProfile = {
        id: 'agent-' + (username || 'operative').toLowerCase().replace(/\s+/g, '-'),
        username: username || 'SpecterAgent',
        badgeNumber: 'CIB-' + Math.floor(1000 + Math.random() * 9000),
        rank: 'Lead Investigator',
        clearanceLevel: 'LEVEL-3 CONFIDENTIAL',
        score: 150,
        completedCaseIds: [],
        token: 'offline-token-' + Date.now(),
      };
      localStorage.setItem('cib_token', fallbackUser.token!);
      localStorage.setItem('cib_local_user', JSON.stringify(fallbackUser));
      setToken(fallbackUser.token!);
      setUser(fallbackUser);
      setIsLoading(false);
      return true;
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
      // Standalone Netlify Mode: Auto-enroll local operative
      const fallbackUser: UserProfile = {
        id: 'agent-' + (username || 'operative').toLowerCase().replace(/\s+/g, '-'),
        username: username || 'SpecterAgent',
        badgeNumber: 'CIB-' + Math.floor(1000 + Math.random() * 9000),
        rank: rank || 'Lead Investigator',
        clearanceLevel: clearance || 'LEVEL-3 CONFIDENTIAL',
        score: 100,
        completedCaseIds: [],
        token: 'offline-token-' + Date.now(),
      };
      localStorage.setItem('cib_token', fallbackUser.token!);
      localStorage.setItem('cib_local_user', JSON.stringify(fallbackUser));
      setToken(fallbackUser.token!);
      setUser(fallbackUser);
      setIsLoading(false);
      return true;
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
