import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLetter } from '@/services/letters';

export const useCreateLetter = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createLetter,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['letters'] });
      qc.invalidateQueries({ queryKey: ['my-letters'] });
    },
  });
};
