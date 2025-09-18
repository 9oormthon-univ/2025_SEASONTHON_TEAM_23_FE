import { useQuery } from '@tanstack/react-query';
import { fetchDailyTopic } from '@/services/dailyTopic';
import { localISODate, todayISO } from '@/utils/calendar/date';

export const useDailyTopic = () => {
  const today = localISODate(todayISO());

  return useQuery({
    queryKey: ['daily-topic', today],
    queryFn: fetchDailyTopic,
    gcTime: 1000 * 60 * 60 * 24, // 24시간 캐시에 보관
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};
