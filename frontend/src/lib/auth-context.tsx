'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthState {
  token: string | null;
  role: string | null;
  patientId: string | null;
  name: string | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, role: string, patientId?: string, name?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    role: null,
    patientId: null,
    name: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        setAuth(JSON.parse(stored));
      } catch {
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = (token: string, role: string, patientId?: string, name?: string) => {
    const newAuth = { token, role, patientId: patientId || null, name: name || null };
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth({ token: null, role: null, patientId: null, name: null });
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        isAuthenticated: !!auth.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
