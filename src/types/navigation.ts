import type { NavigatorScreenParams } from '@react-navigation/native';
import * as Icons from '@icons';

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: undefined;
};

export type TabsParamList = {
  Home: undefined;
  Diary: NavigatorScreenParams<DiaryStackParamList>;
  Letter: undefined;
  Counseling: undefined;
  Profile: undefined;
};

export type DiaryStackParamList = {
  DiaryMain: undefined;
  DiaryWrite: { date?: string } | undefined;
  DiaryByDate: { date?: string } | undefined;
};

export type IconMap = Record<
  keyof TabsParamList,
  { icon: keyof typeof Icons; name: string; title?: string }
>;
