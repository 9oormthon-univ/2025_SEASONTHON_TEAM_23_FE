import {
  login,
  loginWithKakaoAccount,
  logout as kakaoLogout,
  type KakaoOAuthToken,
} from '@react-native-seoul/kakao-login';
import { api } from '../axiosInstance';
import { tokenStore } from './tokenStore';

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

export const signInWithKakao = async (): Promise<void> => {
  const kakaoAccessToken = await getKakaoAccessToken();

  const { data } = await api.post('/auth/kakao', {
    kakaoAccessToken,
  });

  await tokenStore.savePair({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
};

export const signOutAll = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch {}
  try {
    await kakaoLogout();
  } catch {}
  await tokenStore.clear();
};

export const unlinkAccount = async (): Promise<void> => {
  await api.post('/auth/unlink');
  try {
    await kakaoLogout();
  } catch {}
  await tokenStore.clear();
};
