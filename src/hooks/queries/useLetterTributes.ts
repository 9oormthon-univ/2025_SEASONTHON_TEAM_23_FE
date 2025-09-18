import { useQuery } from '@tanstack/react-query';
import { fetchTributes as fetchLetterTributes } from '@/services/letters';

export const useLetterTributes = (letterId?: string) => {
  return useQuery({
    queryKey: ['letter-tributes', letterId],
    queryFn: () => fetchLetterTributes(letterId as string),
    enabled: !!letterId,
  });
};
