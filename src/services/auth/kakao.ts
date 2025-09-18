import {
  login,
  loginWithKakaoAccount,
  logout as kakaoLogout,
  type KakaoOAuthToken,
} from '@react-native-seoul/kakao-login';
import { api } from '../axiosInstance';
import { tokenStore } from './tokenStore';
import type { User } from '@/types/auth';

export const getKakaoAccessToken = async (): Promise<string> => {
  let token: KakaoOAuthToken | null;
  try {
    token = await login();
  } catch {
    token = await loginWithKakaoAccount();
  }
  const at = token?.accessToken;
  if (!at) throw new Error('kakao_login_failed');
  return at;
};

export const signInWithKakao = async (): Promise<User> => {
  const kakaoAccessToken = await getKakaoAccessToken();

  const { data } = await api.post('/auth/kakao', {
    kakaoAccessToken,
  });

  await tokenStore.savePair({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  return data.user;
};

export const signOutAll = async (): Promise<void> => {
  const pair = await tokenStore.loadPair();
  const refreshToken = pair?.refreshToken ?? null;

  try {
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } catch (e) {
    console.error('로그아웃 실패:', e);
  }
  try {
    await kakaoLogout();
  } catch {}
  await tokenStore.clear();
};

export const deleteAccount = async (): Promise<void> => {
  try {
    await api.delete('/auth/me');
  } catch (e: any) {
    const status = e?.response?.status;
    if (![401, 403, 404].includes(status)) {
      console.error('계정 삭제 실패:', e);
      throw e;
    }
  }
  try {
    await kakaoLogout();
  } catch {}
  await tokenStore.clear();
};
