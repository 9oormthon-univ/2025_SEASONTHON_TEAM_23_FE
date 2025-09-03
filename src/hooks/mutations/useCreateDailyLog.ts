// src/hooks/mutations/useCreateDailyLog.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createDailyLog,
  type CreateDailyLogBody,
  type CreateDailyLogResponse,
} from '@/services/dailyLog';

export const useCreateDailyLog = (userId: number) => {
  const qc = useQueryClient();

  return useMutation<CreateDailyLogResponse, unknown, CreateDailyLogBody>({
    mutationFn: (body) => createDailyLog(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['daily-logs', userId] });
    },
  });
};
