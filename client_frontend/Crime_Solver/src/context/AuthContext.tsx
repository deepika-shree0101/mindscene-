import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, rank?: string, clearance?: string) => Promise<boolean>;
  quickGuestAccess: (agentName?: string) => void;
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

  const createFallbackUser = (username: string, rank?: string, clearance?: string): UserProfile => {
    const fallbackUser: UserProfile = {
      id: 'agent-' + (username || 'operative').toLowerCase().replace(/\s+/g, '-'),
      username: username || 'SpecterAgent',
      badgeNumber: 'CIB-' + Math.floor(1000 + Math.random() * 9000),
      rank: rank || 'Lead Investigator',
      clearanceLevel: clearance || 'LEVEL-3 CONFIDENTIAL',
      score: 150,
      completedCaseIds: [],
      token: 'offline-token-' + Date.now(),
    };
    localStorage.setItem('cib_token', fallbackUser.token!);
    localStorage.setItem('cib_local_user', JSON.stringify(fallbackUser));
    return fallbackUser;
  };

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
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          setUser(data);
        } else {
          // Check local user cache before dropping token
          const localUser = localStorage.getItem('cib_local_user');
          if (localUser) {
            try {
              const parsed = JSON.parse(localUser);
              if (parsed && typeof parsed === 'object') {
                setUser(parsed);
                return;
              }
            } catch {
              // Corrupt cache
            }
          }
          // Netlify static deployment: auto-clearance for detective
          const fallbackUser = createFallbackUser('Lead Investigator');
          setUser(fallbackUser);
        }
      } catch {
        const localUser = localStorage.getItem('cib_local_user');
        if (localUser) {
          try {
            const parsed = JSON.parse(localUser);
            if (parsed && typeof parsed === 'object') {
              setUser(parsed);
              return;
            }
          } catch {
            // Corrupt
          }
        }
        const fallbackUser = createFallbackUser('Lead Investigator');
        setUser(fallbackUser);
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

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        localStorage.setItem('cib_token', data.token);
        localStorage.setItem('cib_local_user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        setIsLoading(false);
        return true;
      }

      // 404/405/5xx or HTML response means static host (Netlify)
      if (res.status === 404 || res.status === 405 || res.status >= 500 || !contentType.includes('application/json')) {
        console.warn('Backend API offline or Netlify static host: authenticating locally.');
        const localSaved = localStorage.getItem('cib_local_user');
        let userObj: UserProfile;
        try {
          userObj = localSaved ? JSON.parse(localSaved) : createFallbackUser(username);
        } catch {
          userObj = createFallbackUser(username);
        }
        localStorage.setItem('cib_token', userObj.token || 'offline-token');
        setToken(userObj.token || 'offline-token');
        setUser(userObj);
        setIsLoading(false);
        return true;
      }

      // Real 401/403 credentials error from backend
      const errorData = await res.json().catch(() => ({}));
      setError(errorData.message || 'Access Denied: Invalid Agent Credentials');
      setIsLoading(false);
      return false;
    } catch {
      // Offline / Network failure: seamless local agent clearance
      const localSaved = localStorage.getItem('cib_local_user');
      let userObj: UserProfile;
      try {
        userObj = localSaved ? JSON.parse(localSaved) : createFallbackUser(username);
      } catch {
        userObj = createFallbackUser(username);
      }
      localStorage.setItem('cib_token', userObj.token || 'offline-token');
      setToken(userObj.token || 'offline-token');
      setUser(userObj);
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

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        localStorage.setItem('cib_token', data.token);
        localStorage.setItem('cib_local_user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        setIsLoading(false);
        return true;
      }

      // 404/405/5xx or HTML response means static host (Netlify)
      if (res.status === 404 || res.status === 405 || res.status >= 500 || !contentType.includes('application/json')) {
        console.warn('Backend API offline or Netlify static host: enrolling operative locally.');
        const fallbackUser = createFallbackUser(username, rank, clearance);
        setToken(fallbackUser.token!);
        setUser(fallbackUser);
        setIsLoading(false);
        return true;
      }

      // Real 400/409 error from backend
      const errorData = await res.json().catch(() => ({}));
      setError(errorData.error || 'Registration failed');
      setIsLoading(false);
      return false;
    } catch {
      // Offline / Network failure: auto-enroll local operative
      const fallbackUser = createFallbackUser(username, rank, clearance);
      setToken(fallbackUser.token!);
      setUser(fallbackUser);
      setIsLoading(false);
      return true;
    }
  };

  const quickGuestAccess = (agentName?: string) => {
    const fallbackUser = createFallbackUser(agentName || 'Agent ' + Math.floor(100 + Math.random() * 900));
    setToken(fallbackUser.token!);
    setUser(fallbackUser);
    setError(null);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('cib_token');
    localStorage.removeItem('cib_local_user');
    setToken(null);
    setUser(null);
  };

  const updateUserScore = (scoreToAdd: number, caseId?: string) => {
    if (!user) return;
    const currentCompleted = Array.isArray(user.completedCaseIds) ? user.completedCaseIds : [];
    const updatedCases = caseId && !currentCompleted.includes(caseId)
      ? [...currentCompleted, caseId]
      : currentCompleted;

    const updatedUser: UserProfile = {
      ...user,
      score: (user.score || 0) + scoreToAdd,
      completedCaseIds: updatedCases
    };
    setUser(updatedUser);
    try {
      localStorage.setItem('cib_local_user', JSON.stringify(updatedUser));
    } catch {
      // Storage blocked
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, quickGuestAccess, logout, updateUserScore, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
