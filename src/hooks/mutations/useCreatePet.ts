import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPet } from '@/services/pets';
import type { CreatePetDto, Pet } from '@/types/pets';
import { setActivePetId } from '@/store/activePet';

export const useCreatePet = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePetDto) => createPet(dto),

    onSuccess: async (res) => {
      const created = ((res as any)?.data ?? res) as Partial<Pet> | undefined;

      // 1) 로컬 캐시 보강 (myPets 기준으로 맞춰줌)
      qc.setQueryData(['myPets'], (prev?: Pet[]) => {
        const arr = Array.isArray(prev) ? prev : [];
        if (created?.id != null && !arr.some((p) => p.id === created.id)) {
          return [...arr, created as Pet];
        }
        return arr;
      });

      // (기존 코드 호환: ['pets']도 유지하고 싶다면 같이 갱신)
      qc.setQueryData(['pets'], (prev?: Pet[]) => {
        const arr = Array.isArray(prev) ? prev : [];
        if (created?.id != null && !arr.some((p) => p.id === created.id)) {
          return [...arr, created as Pet];
        }
        return arr;
      });

      // 2) 새 펫을 활성 펫으로 지정(선택 사항이지만 UX 좋음)
      if (created?.id != null) {
        qc.setQueryData(['activePetId'], created.id);
        await setActivePetId(created.id);
      }

      // 3) 서버와 최종 동기화 → RootNavigator의 needsPet 재평가 유도
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['myPets'] }),
        qc.invalidateQueries({ queryKey: ['pets'] }),
        qc.invalidateQueries({ queryKey: ['activePetId'] }),
      ]);
    },
  });
};
