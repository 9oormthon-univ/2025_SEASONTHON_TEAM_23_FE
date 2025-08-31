import * as Linking from 'expo-linking';
import { type LinkingOptions } from '@react-navigation/native';
import { type RootStackParamList } from '@/types/navigation';

const prefix = Linking.createURL('/');

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'petfarewell://', 'https://petfarewell.site'],
  config: {
    screens: {
      Tabs: {
        screens: {
          Home: '',
          Diary: 'diary',
          Letter: 'letter',
          Counseling: 'counseling',
        },
      },
    },
  },

  async getInitialURL() {
    const url = await Linking.getInitialURL();
    return url ?? null;
  },

  subscribe(listener) {
    const sub = Linking.addEventListener('url', ({ url }) => listener(url));
    return () => sub.remove();
  },
};
