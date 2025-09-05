import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDailyLogs } from '@/services/dailyLog';
import { moodColorFromNumber } from '@/utils/calendar/mood';
import type { DailyLog } from '@/types/diary';

export const useDailyLogs = (userId?: number) => {
  const qc = useQueryClient();
  const listKey = ['daily-logs', userId];
  const tombKey = ['daily-logs-removed', userId];

  const query = useQuery({
    queryKey: listKey,
    queryFn: () => fetchDailyLogs(userId as number),
    enabled: !!userId,
  });

  const removedQ = useQuery<number[]>({
    queryKey: tombKey,
    initialData: [],
    queryFn: async () => qc.getQueryData<number[]>(tombKey) ?? [],
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const removedIds = removedQ.data ?? [];

  const filtered = useMemo<DailyLog[] | undefined>(() => {
    if (!query.data) return query.data;
    if (!removedIds.length) return query.data;
    const set = new Set(removedIds);
    return query.data.filter((l) => !set.has(l.id));
  }, [query.data, removedIds]);

  // 날짜 → 원형 배경색
  const moodColorByDate = useMemo(() => {
    const map: Record<string, string> = {};
    filtered?.forEach((l) => {
      const c = moodColorFromNumber(l.mood);
      if (c) map[l.logDate] = c;
    });
    return map;
  }, [filtered]);

  // 전체를 날짜 키로도 보관하고 싶으면
  const byDate = useMemo(() => {
    const map: Record<string, DailyLog> = {};
    filtered?.forEach((l) => (map[l.logDate] = l));
    return map;
  }, [filtered]);

  const byLogId = useMemo(() => {
    const map: Record<number, DailyLog> = {};
    filtered?.forEach((l) => (map[l.id] = l));
    return map;
  }, [filtered]);

  return { ...query, data: filtered, moodColorByDate, byDate, byLogId };
};
