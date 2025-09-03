import { api } from '@/services/axiosInstance';
import type { DailyLog } from '@/types/diary';

export const fetchDailyLogs = async (userId: string) => {
  const { data } = await api.get<DailyLog[]>('/daily-log/list', { params: { userId } });
  return data;
};
