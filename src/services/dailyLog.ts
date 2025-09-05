import { api } from '@/services/axiosInstance';
import type {
  CreateDailyLogBody,
  CreateDailyLogResponse,
  DailyLog,
  DailyLogDetail,
  UpdateDailyLogBody,
} from '@/types/diary';

export const fetchDailyLogs = async (userId: number) => {
  const { data } = await api.get<DailyLog[]>('/daily-log/list', { params: { userId } });
  return data;
};

export const createDailyLog = async (body: CreateDailyLogBody): Promise<CreateDailyLogResponse> => {
  const { data } = await api.post<CreateDailyLogResponse>('/daily-log/create', body);
  return data;
};

export const fetchDailyLogDetail = async (logId: number): Promise<DailyLogDetail> => {
  const { data } = await api.get<DailyLogDetail>(`/daily-log/${logId}`);
  return data;
};

export const updateDailyLog = async (logId: number, body: UpdateDailyLogBody): Promise<void> => {
  await api.put(`/daily-log/update/${logId}`, body);
};

export const deleteDailyLog = async (logId: number): Promise<void> => {
  await api.delete(`/daily-log/delete/${logId}`);
};
