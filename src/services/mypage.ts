import { api } from './axiosInstance';

export type MyPageSummary = {
  dailyLogCount: number;
  letterCount: number;
  tributeCount: number;
};

export const fetchMyPageSummary = async (): Promise<MyPageSummary> => {
  const { data } = await api.get('/mypage/summary');
  return data;
};
