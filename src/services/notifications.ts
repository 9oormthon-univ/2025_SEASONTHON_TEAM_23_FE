import { api } from '@/services/axiosInstance'; // 기존 axios 인스턴스

export async function fetchNoreadTributeCount(userId: number): Promise<number> {
  const { data } = await api.get<{ noreadTributeCount: number }>('/tributes/notifications/recent', {
    params: { userId },
  });
  return Number(data?.noreadTributeCount ?? 0);
}
