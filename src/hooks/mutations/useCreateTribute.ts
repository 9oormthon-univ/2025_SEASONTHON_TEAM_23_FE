import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTribute } from '@/services/letters';

export const useCreateTribute = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (letterId: string | number) => createTribute(letterId),
    onSuccess: (_data, letterId) => {
      qc.invalidateQueries({ queryKey: ['letter-tributes', String(letterId)] });
      qc.invalidateQueries({ queryKey: ['letter-detail', letterId] });
    },
  });
};
