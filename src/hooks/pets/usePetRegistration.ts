import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useCreatePet } from '@/hooks/mutations/useCreatePet';
import { buildCreatePetPayload } from '@/utils/payload';

// 화면에서 SelectBox가 string | number를 줄 수 있으니 타입 유연하게
type Value = string | number;

export const usePetRegistration = () => {
  const [petName, setPetName] = useState('');
  const [selectSpecies, setSelectSpecies] = useState<string[]>([]);
  const [selectPersonality, setSelectPersonality] = useState<string[]>([]);

  // 서버 요청 훅
  const { mutate: registerPet, isPending } = useCreatePet();

  // 검증
  const canSubmit = useMemo(
    () => petName.trim().length > 0 && selectSpecies.length === 1 && selectPersonality.length >= 1,
    [petName, selectSpecies, selectPersonality]
  );

  const disabled = !canSubmit || isPending;

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
  const onSubmit = useCallback(() => {
    if (!canSubmit || isPending) return;

    const payload = buildCreatePetPayload({
      name: petName,
      species: selectSpecies[0], // 단일 선택
      personalities: selectPersonality, // 다중 선택
    });

    registerPet(payload, {
      onSuccess: () => {
        Alert.alert('등록 완료', '반려동물 등록이 완료되었습니다.', [{ text: '확인' }]);
      },
      onError: () => {
        Alert.alert('실패', '등록 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      },
    });
  }, [canSubmit, isPending, petName, selectSpecies, selectPersonality, registerPet]);

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
    isPending,
    onSubmit,
  };
};
