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

export type CreateDailyLogBody = {
  logDate: string; // 'YYYY-MM-DD'
  mood: number; // 서버 규약(0~N)
  content: string; // 본문
  needAiReflection: boolean; // 짧은 공감문 생성 여부
};

export type CreateDailyLogResponse = {
  id: number;
};

export type DailyTopic = {
  topic: string;
  date: string;
};

export type DailyLogDetail = {
  id: number;
  logDate: string;
  topic: string;
  content: string;
  mood: number;
  aiReflection: string;
};

export type UpdateDailyLogBody = {
  mood: number;
  content: string;
  needAiReflection: boolean;
};
