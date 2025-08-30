export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: undefined;
};

export type TabsParamList = {
  Home: undefined;
  Diary: undefined;
  Letter: undefined;
  Counseling: undefined;
};

export interface LetterContextType {
  showMyLetters: boolean;
  setShowMyLetters: (value: boolean) => void;
}