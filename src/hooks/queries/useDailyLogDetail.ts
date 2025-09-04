import { useQuery } from '@tanstack/react-query';
import { fetchDailyLogDetail } from '@/services/dailyLog';

export const useDailyLogDetail = (logId?: number) => {
  return useQuery({
    queryKey: ['daily-log-detail', logId],
    queryFn: () => fetchDailyLogDetail(logId as number),
    enabled: typeof logId === 'number',
  });
};
