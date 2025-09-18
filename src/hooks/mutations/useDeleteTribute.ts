import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTributeById } from '@/services/letters';

export const useDeleteTribute = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (tributeId: string | number) => deleteTributeById(tributeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['letter-tributes'] });
      qc.invalidateQueries({ queryKey: ['letter-detail'] });
    },
  });
};
