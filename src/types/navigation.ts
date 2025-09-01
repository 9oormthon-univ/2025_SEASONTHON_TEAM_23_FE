import * as Icons from '@icons';

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: undefined;
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
