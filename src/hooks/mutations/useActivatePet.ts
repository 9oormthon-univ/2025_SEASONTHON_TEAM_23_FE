import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activatePet } from '@/services/pets';
import { getActivePetId, setActivePetId } from '@/store/activePet';

export const useActivatePet = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (petId: number) => activatePet(petId),

    // 선택 즉시 낙관적 업데이트: 전역 activePetId를 교체
    onMutate: async (petId: number) => {
      await qc.cancelQueries({ queryKey: ['activePetId'] });

      const previous = qc.getQueryData<number | null>(['activePetId']) ?? null;

      // 캐시 먼저 반영
      qc.setQueryData(['activePetId'], petId);
      // 영속화
      await setActivePetId(petId);

      return { previous };
    },

    // 실패 시 롤백
    onError: async (_err, _petId, ctx) => {
      const prev = ctx?.previous ?? (await getActivePetId());
      qc.setQueryData(['activePetId'], prev ?? null);
      await setActivePetId(prev ?? null);
    },

    // 성공 시 서버와 클라 동기화 확인
    onSuccess: async (_data, petId) => {
      qc.setQueryData(['activePetId'], petId);
      await setActivePetId(petId);
    },

    // 최종적으로 관련 목록 리프레시(필요 시)
    onSettled: () => {
      // 목록 UI를 새로 쓰지 않는다면 생략 가능
      qc.invalidateQueries({ queryKey: ['myPets'], exact: true });
      qc.invalidateQueries({ queryKey: ['activePetId'], exact: true });
    },
  });
};
