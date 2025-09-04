import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/services/axiosInstance';
import { tokenStore } from '@/services/auth/tokenStore';
import type { User } from '@/types/auth';
import { signInWithKakao, signOutAll, unlinkAccount } from '@/services/auth/kakao';

type AuthContextValue = {
  user: User | null;
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
      const pair = await tokenStore.loadPair();
      try {
        const access = pair?.accessToken ?? null;
        const refresh = pair?.refreshToken ?? null;
        const masked = (t: string | null) => (t ? `${t.slice(0, 20)}...${t.slice(-6)}` : null);
        // eslint-disable-next-line no-console
        console.debug('[DEBUG tokens masked] access=', masked(access), 'refresh=', masked(refresh));
        // In dev only, print full tokens so you can copy for curl. Remove this after use.
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.debug('[DEBUG tokens full - DEV ONLY]', { access, refresh });
        }
      } catch (e) {
        // ignore
      }
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
