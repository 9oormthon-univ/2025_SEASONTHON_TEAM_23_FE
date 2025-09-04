import axios from 'axios';
import { tokenStore } from './auth/tokenStore';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

// helper: convert snake_case keys to camelCase recursively
const toCamel = (input: any): any => {
  if (Array.isArray(input)) return input.map(toCamel);
  if (input && typeof input === 'object') {
    const obj: Record<string, any> = {};
    for (const [k, v] of Object.entries(input)) {
      const camelKey = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      obj[camelKey] = toCamel(v);
    }
    return obj;
  }
  return input;
};

let isRefreshing = false;
let waiters: ((t: string | null) => void)[] = [];
const notify = (t: string | null) => {
  waiters.forEach((w) => w(t));
  waiters = [];
};

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // debug: log outgoing request method/url and whether Authorization header is present
  try {
    // avoid leaking full tokens in logs; show masked snippet for debugging
    const auth = String(config.headers?.Authorization ?? '');
    const masked = auth ? `${auth.slice(0, 20)}...${auth.slice(-6)}` : '';
    // eslint-disable-next-line no-console
    console.debug('[api] request', config.method, config.url, 'hasAuth=', Boolean(auth), 'auth=', masked);
  } catch (e) {}
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

      // debug: log response status, url, body and headers when an error occurs
      try {
        // eslint-disable-next-line no-console
        console.debug('[api] response error', config?.url, 'status=', response?.status, 'data=', response?.data, 'headers=', response?.headers);
      } catch (e) {}

      throw error;
  }
);
