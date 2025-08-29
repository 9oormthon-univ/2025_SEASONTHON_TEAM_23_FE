import * as Keychain from 'react-native-keychain';
import { type AppTokens } from '@/types/auth';

let memoryAccessToken: string | null = null;

export const tokenStore = {
  getAccess: (): string | null => memoryAccessToken,
  
  savePair: async (tokens: AppTokens) => {
    memoryAccessToken = tokens.accessToken;
    await Keychain.setGenericPassword(
        'ignored',
        JSON.stringify(tokens),
        {
          service: 'app.tokens',
          accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
        }
    );
  },
  
  loadPair: async (): Promise<AppTokens | null> => {
    const v = await Keychain.getGenericPassword({ service: 'app.tokens' });
    if (!v) return null;
    const parsed = JSON.parse(v.password) as AppTokens;
    memoryAccessToken = parsed.accessToken;
    return parsed;
  },
  
  clear: async () => {
    memoryAccessToken = null;
    await Keychain.resetGenericPassword({ service: 'app.tokens' });
  },
};
