import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDailyLogs } from '@/services/dailyLog';
import { moodColorFromNumber } from '@/utils/calendar/mood';
import type { DailyLog } from '@/types/diary';

export const useDailyLogs = (userId?: number) => {
  const query = useQuery({
    queryKey: ['daily-logs', userId],
    queryFn: () => fetchDailyLogs(userId as number),
    enabled: !!userId,
  });

  // 날짜 → 원형 배경색
  const moodColorByDate = useMemo(() => {
    const map: Record<string, string> = {};
    query.data?.forEach((l) => {
      const c = moodColorFromNumber(l.mood);
      if (c) map[l.logDate] = c;
    });
    return map;
  }, [query.data]);

  // 전체를 날짜 키로도 보관하고 싶으면
  const byDate = useMemo(() => {
    const map: Record<string, DailyLog> = {};
    query.data?.forEach((l) => (map[l.logDate] = l));
    return map;
  }, [query.data]);

  return { ...query, moodColorByDate, byDate };
};
