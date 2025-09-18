import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { fetchMyPets, deletePet } from '@/services/pets';
import type { Pet } from '@/types/pets';

type Options = {
  onEmpty?: () => void; // 삭제 후 0마리일 때 호출
};

export const usePetsList = (opts: Options = {}) => {
  const { onEmpty } = opts;
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchMyPets();
      setPets(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const onDelete = useCallback(
    async (pet: Pet) => {
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
    [onEmpty]
  );

  return { pets, setPets, loading, reload, onDelete };
};
