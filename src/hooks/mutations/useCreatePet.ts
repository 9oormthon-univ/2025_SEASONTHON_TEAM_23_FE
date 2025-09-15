import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPet } from '@/services/pets';
import type { CreatePetDto } from '@/types/pets';

export const useCreatePet = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePetDto) => createPet(dto),
    onSuccess: () => {
      // 펫 목록 캐시 리프레시 → Root에서 /pets 기반 gate 쓰면 바로 반영됨
      qc.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};
