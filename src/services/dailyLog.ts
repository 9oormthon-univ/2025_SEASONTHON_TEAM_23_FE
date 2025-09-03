import { api } from '@/services/axiosInstance';
import type { DailyLog } from '@/types/diary';

export const fetchDailyLogs = async (userId: number) => {
  const { data } = await api.get<DailyLog[]>('/daily-log/list', { params: { userId } });
  return data;
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

export const createDailyLog = async (body: CreateDailyLogBody): Promise<CreateDailyLogResponse> => {
  const { data } = await api.post<CreateDailyLogResponse>('/daily-log/create', body);
  return data;
};
