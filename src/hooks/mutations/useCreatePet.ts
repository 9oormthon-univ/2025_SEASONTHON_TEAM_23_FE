import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPet } from '@/services/pets';
import type { CreatePetDto } from '@/types/pets';

export const useCreatePet = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePetDto) => createPet(dto),
    onSuccess: (res) => {
      const newPet = (res as any)?.data ?? res;

      qc.setQueryData(['pets'], (prev: any) => {
        const arr = Array.isArray(prev) ? prev : [];
        // 중복 방지
        if (newPet && !arr.find((p: any) => p.id === newPet.id)) {
          return [...arr, newPet];
        }
        return arr.length ? arr : newPet ? [newPet] : arr;
      });

      // 안전하게 서버와 동기화
      qc.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};
