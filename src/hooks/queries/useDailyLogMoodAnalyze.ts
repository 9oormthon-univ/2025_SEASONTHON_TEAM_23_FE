import { useQuery } from '@tanstack/react-query';
import { fetchDailyLogMoodAnalyze } from '@/services/dailyLog';

// 지난 달 작성된 mood 통계 조회 훅
export const useDailyLogMoodAnalyze = (enabled = true) => {
  return useQuery({
    queryKey: ['daily-log-mood-analyze'],
    queryFn: fetchDailyLogMoodAnalyze,
    enabled,
  });
};
