import * as Icons from '@icons';

import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: NavigatorScreenParams<TabsParamList>;
  DiaryWritePage: undefined;
  LetterWriteScreen: undefined;
  LetterScreen: undefined;
  LetterDetail: { id: string };
};

export type TabsParamList = {
  Home: undefined;
  Diary: undefined;
  Letter: undefined;
  Counseling: undefined;
  Profile: undefined;
};

export type IconMap = Record<
  keyof TabsParamList,
  { icon: keyof typeof Icons; name: string; title?: string }
>;

export interface LetterContextType {
  showMyLetters: boolean;
  setShowMyLetters: (value: boolean) => void;
}