import { useQuery } from '@tanstack/react-query';
import { fetchMyPets } from '@/services/pets';

export function useNeedsPetProfile(enabled: boolean) {
  const q = useQuery({
    queryKey: ['myPets'],
    queryFn: fetchMyPets,
    enabled, // 로그인 시에만 호출
    staleTime: 60_000,
  });

  const needsPet = enabled ? (Array.isArray(q.data) ? q.data.length === 0 : false) : false;

  return {
    needsPet,
    loading: enabled && q.isLoading,
    error: q.isError ? (q.error as Error)?.message : null,
  };
}
