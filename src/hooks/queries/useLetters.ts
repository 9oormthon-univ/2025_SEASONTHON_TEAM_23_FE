import { useQuery } from '@tanstack/react-query';
import { fetchLetters, fetchMyLetters } from '@/services/letters';

export const useLetters = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['letters', page, size],
    queryFn: () => fetchLetters(page, size),
  });
};

export const useMyLetters = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['my-letters', page, size],
    queryFn: () => fetchMyLetters(page, size),
  });
};
