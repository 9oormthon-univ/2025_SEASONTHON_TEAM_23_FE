import axios from 'axios';
import {tokenStore} from "./auth/tokenStore";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

let isRefreshing = false;
let waiters: ((t: string | null) => void)[] = [];
const notify = (t: string | null) => { waiters.forEach(w => w(t)); waiters = []; };

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const { response, config } = error || {};
      if (!response) throw error;
      
      if (response.status === 401 && !config._retry) {
        config._retry = true;
        
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const saved = await tokenStore.loadPair();
            const refreshToken = saved?.refreshToken;
            if (!refreshToken) throw new Error('no refresh token');
            
            const { data } = await axios.post(`${api.defaults.baseURL}/auth/token/access`, {
              refreshToken,
            });
            
            const { accessToken, refreshToken: newRefreshToken } = data;
            await tokenStore.savePair({
              accessToken,
              refreshToken: newRefreshToken ?? refreshToken,
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
      
      throw error;
    }
);