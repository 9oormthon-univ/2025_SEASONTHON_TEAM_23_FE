import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLetter } from '@/services/letters';

export const useDeleteLetter = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (letterId: number | string) => deleteLetter(letterId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['letters'] });
      qc.invalidateQueries({ queryKey: ['my-letters'] });
      qc.invalidateQueries({ queryKey: ['letter-detail'] });
    },
  });
};
