import { useQuery } from '@tanstack/react-query';
import { fetchMyPets } from '@/services/pets';
import type { Pet } from '@/types/pets';

export const useMyPets = (enabled: boolean) => {
  const q = useQuery({
    queryKey: ['myPets'],
    queryFn: fetchMyPets,
    enabled, // 로그인 시에만 호출
    staleTime: 60_000,
  });

  const pets = (Array.isArray(q.data) ? q.data : []) as Pet[];
  const needsPet = enabled ? (Array.isArray(q.data) ? q.data.length === 0 : false) : false;

  return {
    pets,
    needsPet,
    loading: enabled && q.isLoading,
    error: q.isError ? (q.error as Error)?.message : null,
    refetch: q.refetch,
  };
};
