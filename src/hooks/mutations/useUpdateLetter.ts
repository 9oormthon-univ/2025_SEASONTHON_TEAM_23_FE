import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLetter } from '@/services/letters';

type UpdateLetterVars = {
  letterId: number | string;
  params: Partial<{
    content: string;
    isPublic: boolean;
    image: { uri: string; name?: string; type?: string } | null;
    removeImage: boolean;
  }>;
};

export const useUpdateLetter = () => {
  const qc = useQueryClient();

  return useMutation<void, unknown, UpdateLetterVars>({
    mutationFn: ({ letterId, params }) => updateLetter(letterId, params),
    onSuccess: (_data, vars) => {
      const { letterId } = vars;
      qc.invalidateQueries({ queryKey: ['letter-detail', letterId] });
      qc.invalidateQueries({ queryKey: ['letters'] });
      qc.invalidateQueries({ queryKey: ['my-letters'] });
    },
  });
};
