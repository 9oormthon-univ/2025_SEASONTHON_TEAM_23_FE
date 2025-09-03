import type { User } from '@/types/auth';

type PresetQuestions = {
  prompt: string;
  isActive: boolean;
  weight: number;
  createdAt: string;
  id: number;
};

type Emotions = {
  code: string;
  labelKo: string;
  emoji: string;
  sortOrder: number;
};

export type Diaries = {
  id: string;
  userId: User['id'];
  questionId: PresetQuestions['id'];
  emotionCode: Emotions['code'];
  content: string;
  createdAt: string;
};

export type DailyLog = {
  id: number;
  logDate: string;
  topic: string;
  preview: string;
  mood: number;
};
