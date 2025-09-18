import { useQuery } from '@tanstack/react-query';
import { fetchMyPageSummary } from '@/services/mypage';

export const useMyPageSummary = (enabled = true) => {
  return useQuery({
    queryKey: ['mypage-summary'],
    queryFn: fetchMyPageSummary,
    enabled,
  });
};
