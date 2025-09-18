import type { NavigatorScreenParams } from '@react-navigation/native';
import * as Icons from '@icons';
import type { Pet } from '@/types/pets';

export type RootStackParamList = {
  Onboarding: undefined;
  Gate: undefined;
  Tabs: NavigatorScreenParams<TabsParamList>;
  MyDailyLogs: undefined;
  MyLetters: undefined;
  NotificationList: undefined;
  PetRegistration: undefined;
};

export type TabsParamList = {
  Home: undefined;
  Diary: NavigatorScreenParams<DiaryStackParamList>;
  Letter: NavigatorScreenParams<LetterStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
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

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Setting: undefined;
  ImageSetting: undefined;
  PetManage: undefined;
  PetRegistrationInProfile: { pet?: Pet } | undefined;
};

export type IconMap = Record<
  keyof TabsParamList,
  { icon: keyof typeof Icons; name: string; title?: string }
>;
