import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { buildCreatePetPayload } from '@/utils/payload';
import type { Pet } from '@/types/pets';
import { createPet, updatePet } from '@/services/pets';

// 화면에서 SelectBox가 string | number를 줄 수 있으니 타입 유연하게
type Value = string | number;

type UsePetRegistrationOptions = {
  onSuccessNav?: () => void;
  initialPet?: Pet | null;
};

export const usePetRegistration = (opts: UsePetRegistrationOptions = {}) => {
  const { onSuccessNav, initialPet } = opts;
  const [petName, setPetName] = useState(initialPet?.name ?? '');
  const [selectSpecies, setSelectSpecies] = useState<string[]>(
    initialPet?.breed ? [String(initialPet.breed)] : []
  );
  const [selectPersonality, setSelectPersonality] = useState<string[]>(
    initialPet?.personality
      ? String(initialPet.personality)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  );

  // 초기값이 바뀌는 경우 대응
  useEffect(() => {
    if (!initialPet) return;
    setPetName(initialPet.name ?? '');
    setSelectSpecies(initialPet.breed ? [String(initialPet.breed)] : []);
    setSelectPersonality(
      initialPet.personality
        ? String(initialPet.personality)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []
    );
  }, [initialPet?.id]);

  // 검증
  const canSubmit = useMemo(
    () => petName.trim().length > 0 && selectSpecies.length === 1 && selectPersonality.length >= 1,
    [petName, selectSpecies, selectPersonality]
  );

  const [isSaving, setIsSaving] = useState(false);
  const disabled = !canSubmit || isSaving;

  // SelectBox onChange 핸들러 (숫자여도 문자열로 정규화)
  const handleSpeciesChange = useCallback(
    (next: Value[]) => setSelectSpecies(next.map(String)),
    []
  );
  const handlePersonalityChange = useCallback(
    (next: Value[]) => setSelectPersonality(next.map(String)),
    []
  );

  // 제출
  const onSubmit = useCallback(async () => {
    if (!canSubmit || isSaving) return;
    setIsSaving(true);

    try {
      // 편집 모드면 update, 아니면 create
      if (initialPet?.id != null) {
        await updatePet(initialPet.id, {
          name: petName.trim(),
          breed: String(selectSpecies[0]),
          personality: selectPersonality.join(','),
        });
      } else {
        const payload = buildCreatePetPayload({
          name: petName,
          species: selectSpecies[0],
          personalities: selectPersonality,
        });
        await createPet(payload);
      }

      Alert.alert('저장 완료', '반려동물 정보가 저장되었습니다.', [
        { text: '확인', onPress: () => onSuccessNav?.() },
      ]);
    } catch (e) {
      Alert.alert('실패', '저장 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  }, [
    canSubmit,
    isSaving,
    initialPet?.id,
    petName,
    selectSpecies,
    selectPersonality,
    onSuccessNav,
  ]);

  return {
    fields: {
      petName,
      selectSpecies,
      selectPersonality,
    },
    setPetName,
    handleSpeciesChange,
    handlePersonalityChange,
    canSubmit,
    disabled,
    isPending: isSaving,
    onSubmit,
  };
};
