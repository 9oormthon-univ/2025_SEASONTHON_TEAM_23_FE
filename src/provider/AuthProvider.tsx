import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/services/axiosInstance';
import { tokenStore } from '@/services/auth/tokenStore';
import type { AuthMeResponse } from '@/types/auth';
import { signInWithKakao, signOutAll, unlinkAccount } from '@/services/auth/kakao';

type AuthContextValue = {
  user: AuthMeResponse | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  unlink: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthMeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data ?? null);
    } catch {
      setUser(null);
    }
  };

  const login = async () => {
    await signInWithKakao();
    await refreshUser();
  };

  const logout = async () => {
    await signOutAll();
    setUser(null);
  };

  const unlink = async () => {
    await unlinkAccount();
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      await tokenStore.loadPair();
      await refreshUser();
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, unlink, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 훅은 반드시 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
};
