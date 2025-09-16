import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/services/axiosInstance';
import { tokenStore } from '@/services/auth/tokenStore';
import type { AuthMeResponse } from '@/types/auth';
import { signInWithKakao, signOutAll, deleteAccount } from '@/services/auth/kakao';

type AuthContextValue = {
  user: AuthMeResponse | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  withdraw: () => Promise<void>;
  refreshUser: () => Promise<void>;
  profileImageKey: string | null;
  setProfileImageKey: (key: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthMeResponse | null>(null);
  const [profileImageKey, setProfileImageKey] = useState<string | null>(null);
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

  const withdraw = async () => {
    await deleteAccount();
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      await tokenStore.loadPair();
      await refreshUser();
      try {
        const savedKey = await AsyncStorage.getItem('profileImageKey');
        if (savedKey) setProfileImageKey(savedKey);
      } catch (e) {
        console.warn('프로필 이미지 키 로드 실패', e);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (profileImageKey) {
          await AsyncStorage.setItem('profileImageKey', profileImageKey);
        } else {
          await AsyncStorage.removeItem('profileImageKey');
        }
      } catch (e) {
        console.warn('프로필 이미지 키 저장 실패', e);
      }
    })();
  }, [profileImageKey]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        withdraw,
        refreshUser,
        profileImageKey,
        setProfileImageKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 훅은 반드시 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
};
