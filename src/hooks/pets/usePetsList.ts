import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { fetchMyPets, deletePet } from '@/services/pets';
import type { Pet } from '@/types/pets';

export const usePetsList = () => {
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

  const onDelete = useCallback((pet: Pet) => {
    Alert.alert('삭제 확인', `${pet.name} 정보를 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePet(pet.id);
            setPets((prev) => prev.filter((p) => p.id !== pet.id));
          } catch (e: any) {
            const msg =
              e?.response?.data?.message || e?.message || '반려동물 정보를 삭제하지 못했습니다.';
            Alert.alert('삭제 실패', msg);
          }
        },
      },
    ]);
  }, []);

  return { pets, setPets, loading, reload, onDelete };
};
