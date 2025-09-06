import type { NavigatorScreenParams } from '@react-navigation/native';
import * as Icons from '@icons';

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: NavigatorScreenParams<TabsParamList>;
  DiaryWritePage: undefined;
  LetterWriteScreen: undefined;
  LetterScreen: undefined;
  LetterDetail: { id: string };
  MyDailyLogs: undefined;
  MyLetters: undefined;
};

export type TabsParamList = {
  Home: undefined;
  Diary: NavigatorScreenParams<DiaryStackParamList>;
  Letter: NavigatorScreenParams<LetterStackParamList>;
  Profile: undefined;
};

export type DiaryStackParamList = {
  DiaryMain: undefined;
  DiaryWrite: { topic: string };
  DiaryByDate: { logId: number };
  DiaryEdit: { logId: number };
};

export type LetterStackParamList = {
  LetterWriteScreen: undefined;
  LetterScreen: undefined;
  LetterDetail: { id: string };
};

export type IconMap = Record<
  keyof TabsParamList,
  { icon: keyof typeof Icons; name: string; title?: string }
>;

export interface LetterContextType {
  showMyLetters: boolean;
  setShowMyLetters: (value: boolean) => void;
}
