import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDailyLog } from '@/services/dailyLog';
import type { UpdateDailyLogBody } from '@/types/diary';

type Vars = { logId: number; body: UpdateDailyLogBody; userId: number };

export const useUpdateDailyLog = () => {
  const qc = useQueryClient();

  return useMutation<void, unknown, Vars>({
    mutationFn: ({ logId, body }) => updateDailyLog(logId, body),
    onSuccess: (_data, vars) => {
      const { logId, userId } = vars;
      qc.invalidateQueries({ queryKey: ['daily-log-detail', logId] });
      qc.invalidateQueries({ queryKey: ['daily-logs', userId] });
    },
  });
};
