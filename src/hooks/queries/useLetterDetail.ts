import { useQuery } from '@tanstack/react-query';
import { fetchLetterById } from '@/services/letters';

export const useLetterDetail = (letterId?: number | string) => {
  return useQuery({
    queryKey: ['letter-detail', letterId],
    queryFn: () => fetchLetterById(letterId as number | string),
    enabled: !!letterId,
  });
};
