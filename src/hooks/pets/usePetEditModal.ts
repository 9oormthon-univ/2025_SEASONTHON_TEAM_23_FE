import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { Pet } from '@/types/pets';
import { updatePet } from '@/services/pets';
import { toCSV } from '@/utils/payload';

type EditingState = {
  pet: Pet;
  name: string;
  selectSpecies: Array<string | number>;
  selectPersonality: Array<string | number>;
};

export const usePetEditModal = (onUpdated?: (p: Pet) => void) => {
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [saving, setSaving] = useState(false);

  const openEdit = useCallback((pet: Pet) => {
    const parsedPers = String(pet.personality ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setEditing({
      pet,
      name: pet.name,
      selectSpecies: pet.breed ? [String(pet.breed)] : [],
      selectPersonality: parsedPers,
    });
  }, []);

  const closeEdit = useCallback(() => setEditing(null), []);

  const setName = useCallback((t: string) => {
    setEditing((s) => (s ? { ...s, name: t } : s));
  }, []);

  const handleSpeciesChange = useCallback(
    (next: Array<string | number>) =>
      setEditing((s) => (s ? { ...s, selectSpecies: next.map(String) } : s)),
    []
  );

  const handlePersonalityChange = useCallback(
    (next: Array<string | number>) =>
      setEditing((s) => (s ? { ...s, selectPersonality: next.map(String) } : s)),
    []
  );

  const submitEdit = useCallback(async () => {
    if (!editing) return;
    const name = editing.name.trim();
    const species = editing.selectSpecies;
    const personalities = editing.selectPersonality;
    if (!name || species.length !== 1 || personalities.length < 1) {
      Alert.alert('입력 확인', '이름을 입력하고, 종/성격을 선택해 주세요.');
      return;
    }
    setSaving(true);
    try {
      const updated = await updatePet(editing.pet.id, {
        name,
        breed: String(species[0]),
        personality: toCSV(personalities),
      });
      onUpdated?.(updated);
      setEditing(null);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || '반려동물 정보를 수정하지 못했습니다.';
      Alert.alert('수정 실패', msg);
    } finally {
      setSaving(false);
    }
  }, [editing, onUpdated]);

  return {
    editing,
    saving,
    openEdit,
    closeEdit,
    setName,
    handleSpeciesChange,
    handlePersonalityChange,
    submitEdit,
    setEditing, // 필요시 직접 접근
  };
};
