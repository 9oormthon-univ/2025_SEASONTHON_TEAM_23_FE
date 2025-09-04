import { api } from '@/services/axiosInstance';
import type { DailyTopic } from '@/types/diary';

export const fetchDailyTopic = async (): Promise<DailyTopic> => {
  const { data } = await api.get<DailyTopic>('/daily-log/topic');
  return data;
};
