import { useQuery } from '@tanstack/react-query';
import { getActivePetId } from '@/store/activePet';

export const useActivePetId = () =>
  useQuery({
    queryKey: ['activePetId'],
    queryFn: getActivePetId,
    initialData: null as number | null,
    staleTime: Infinity,
    gcTime: Infinity,
  });
