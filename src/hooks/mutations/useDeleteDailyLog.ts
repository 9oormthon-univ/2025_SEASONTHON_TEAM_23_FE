import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDailyLog } from '@/services/dailyLog';
import type { DailyLog } from '@/types/diary';

export const useDeleteDailyLog = (userId: number) => {
  const qc = useQueryClient();
  const listKey = ['daily-logs', userId];
  const tombKey = ['daily-logs-removed', userId];

  return useMutation({
    mutationFn: (logId: number) => deleteDailyLog(logId),
    onMutate: async (logId) => {
      await qc.cancelQueries({ queryKey: listKey });
      const prev = qc.getQueryData<DailyLog[]>(listKey);
      if (prev)
        qc.setQueryData<DailyLog[]>(
          listKey,
          prev.filter((l) => l.id !== logId)
        );
      const prevTomb = qc.getQueryData<number[]>(tombKey) ?? [];
      qc.setQueryData<number[]>(tombKey, [...prevTomb, logId]);
      qc.removeQueries({ queryKey: ['daily-log-detail', logId], exact: true });
      return { prev };
    },
    onSuccess: (_res, logId) => {
      qc.invalidateQueries({ queryKey: listKey, refetchType: 'active' });
      qc.removeQueries({ queryKey: ['daily-log-detail', logId], exact: true });
    },
    onError: (_err, _logId, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: listKey, refetchType: 'inactive' });
    },
  });
};
