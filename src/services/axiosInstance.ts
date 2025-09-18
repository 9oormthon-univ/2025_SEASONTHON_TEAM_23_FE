import axios from 'axios';
import { tokenStore } from './auth/tokenStore';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

let isRefreshing = false;
let waiters: ((t: string | null) => void)[] = [];
const notify = (t: string | null) => {
  waiters.forEach((w) => w(t));
  waiters = [];
};

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // debug logs removed
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    if (!response || !config) throw error;

    if (response.status === 401 && !config._retry) {
      config._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const saved = await tokenStore.loadPair();
          const refreshToken = saved?.refreshToken;
          if (!refreshToken) throw new Error('no refresh token');

          const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refreshToken,
          });

          const newAccess = data?.accessToken;
          if (!newAccess) throw new Error('no_access_from_refresh');

          await tokenStore.savePair({
            accessToken: newAccess,
            refreshToken,
          });

          isRefreshing = false;
          notify(tokenStore.getAccess());
        } catch (e) {
          isRefreshing = false;
          await tokenStore.clear();
          notify(null);
          throw e;
        }
      }

      const newToken = await new Promise<string | null>((resolve) => waiters.push(resolve));
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      }
    }

  // debug logs removed

      throw error;
  }
);
