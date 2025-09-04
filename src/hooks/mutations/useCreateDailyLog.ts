import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDailyLog } from '@/services/dailyLog';
import type { CreateDailyLogBody, CreateDailyLogResponse } from '@/types/diary';

export const useCreateDailyLog = (userId: number) => {
  const qc = useQueryClient();

  return useMutation<CreateDailyLogResponse, unknown, CreateDailyLogBody>({
    mutationFn: (body) => createDailyLog(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['daily-logs', userId] });
    },
  });
};
