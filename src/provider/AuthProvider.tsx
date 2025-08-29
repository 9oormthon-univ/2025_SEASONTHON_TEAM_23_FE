import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/services/axiosInstance';
import { tokenStore } from '@/services/auth/tokenStore';
import type { User } from '@/types/auth';

type AuthContextValue = {
  user: User | null;
  setUser: (user: User) => void;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  unlink: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
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
    console.log('로그인 요청');
    await refreshUser();
  };

  const logout = async () => {
    console.log('로그아웃 요청');
    setUser(null);
  };

  const unlink = async () => {
    console.log('회원탈퇴 요청');
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
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, unlink, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 훅은 반드시 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
};
