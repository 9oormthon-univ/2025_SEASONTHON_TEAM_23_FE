import { useMutation } from '@tanstack/react-query';
import { upsertNickname } from '@/services/mypage';
import { queryClient } from '@/provider/queryClient';
import { useAuth } from '@/provider/AuthProvider';

export const useUpsertNickname = () => {
  const { refreshUser } = useAuth();
  return useMutation({
    mutationFn: (nickname: string) => upsertNickname(nickname),
    onSuccess: async () => {
      // 사용자 정보, 마이페이지 요약 refetch
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['mypage-summary'] });
    },
  });
};
