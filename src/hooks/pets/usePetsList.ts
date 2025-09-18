import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { fetchMyPets, deletePet } from '@/services/pets';
import type { Pet } from '@/types/pets';

type Options = {
  onEmpty?: () => void; // 삭제 후 0마리일 때 호출
  navigateIfEmptyOnLoad?: boolean; // 최초/재로드 시 빈 목록이면 onEmpty 호출 (기본 true)
};

export const usePetsList = (opts: Options = {}) => {
  const { onEmpty, navigateIfEmptyOnLoad = true } = opts;
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // 로드 중 빈 목록 처리, 중복 호출 방지
  const emptyHandledRef = useRef(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchMyPets();
      setPets(list);

      if (navigateIfEmptyOnLoad && list.length === 0 && !emptyHandledRef.current) {
        emptyHandledRef.current = true;
        onEmpty?.();
      }
    } finally {
      setLoading(false);
    }
  }, [navigateIfEmptyOnLoad, onEmpty]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const onDelete = useCallback(
    async (pet: Pet) => {
      // 1마리면 바로 차단 (서버 호출 X)
      if (pets.length <= 1) {
        Alert.alert(
          '삭제 불가',
          '등록된 반려동물이 1마리일 때는 삭제할 수 없어요. 새 반려동물을 추가한 뒤 다시 시도해 주세요.'
        );
        return;
      }

      try {
        await deletePet(pet.id);
        setPets((prev) => {
          const next = prev.filter((p) => p.id !== pet.id);
          if (next.length === 0) onEmpty?.();
          return next;
        });
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || '반려동물 정보를 삭제하지 못했습니다.';
        Alert.alert('삭제 실패', msg);
        throw e;
      }
    },
    [pets, onEmpty]
  );

  return { pets, setPets, loading, reload, onDelete };
};
