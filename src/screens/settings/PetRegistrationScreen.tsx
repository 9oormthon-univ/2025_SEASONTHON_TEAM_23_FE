import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { keepAllKorean } from '@/utils/keepAll';
import SelectBox from '@common/SelectBox';
import { useMemo, useState } from 'react';
import { PERSONALITY_CONFLICTS, PERSONALITY_OPTIONS, SPECIES_OPTIONS } from '@/types/select';
import Input from '@common/Input';
import { useCreatePet } from '@/hooks/mutations/useCreatePet';
import Loader from '@common/Loader';

const PetRegistrationScreen = () => {
  const [petName, setPetName] = useState('');
  const [selectSpecies, setSelectSpecies] = useState<string[]>([]);
  const [selectPersonality, setSelectPersonality] = useState<string[]>([]);
  const { mutate: registerPet, isPending } = useCreatePet();

  const canSubmit = useMemo(() => {
    return petName.trim().length > 0 && selectSpecies.length === 1 && selectPersonality.length >= 1;
  }, [petName, selectSpecies, selectPersonality]);

  const disabled = !canSubmit || isPending;

  const onSubmit = () => {
    if (!canSubmit) return;

    const payload = {
      name: petName.trim(),
      breed: selectSpecies[0], // API 스펙상 breed 로 보냄
      personality: selectPersonality.join(','), // 다중 선택을 CSV 문자열로
    };

    registerPet(payload, {
      onSuccess: () => {
        Alert.alert('등록 완료', '반려동물 등록이 완료되었습니다.', [{ text: '확인' }]);
      },
      onError: () => {
        Alert.alert('실패', '등록 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      },
    });
  };

  return (
    <ScrollView className="bg-bg">
      <View className="gap-32 px-7 pb-[90px] pt-5">
        <View className="gap-[52px]">
          <Text className="heading2SB text-white">
            {keepAllKorean('반려동물의\n이름을 입력해주세요.')}
          </Text>
          <View className="gap-8">
            <Input
              label="이름"
              value={petName}
              onChange={(val) => setPetName(val)}
              placeholder="이름을 입력해주세요."
            />
            <SelectBox
              label="종"
              items={SPECIES_OPTIONS}
              values={selectSpecies}
              onChange={(next) => setSelectSpecies(next.map(String))}
              placeholder="종을 선택해주세요."
              maxSelected={1}
              closeOnSelect
            />
            <SelectBox
              label="성격"
              items={PERSONALITY_OPTIONS}
              values={selectPersonality}
              onChange={(next) => setSelectPersonality(next.map(String))}
              placeholder="성격을 선택해주세요."
              conflicts={PERSONALITY_CONFLICTS}
              conflictStrategy="block"
              onConflict={(picked, conflicted) => {
                const names = conflicted.map((c) => c.label).join(', ');
                Alert.alert(
                  '선택할 수 없어요',
                  `"${picked.label}"은 "${names}"과 함께 선택할 수 없어요.`
                );
              }}
            />
          </View>
        </View>
        <Pressable
          disabled={disabled}
          onPress={onSubmit}
          className={`${disabled ? 'bg-[#FFEBB5]' : 'bg-yellow-200'} items-center justify-center rounded-[20px] py-5`}
        >
          {isPending && <Loader />}
          <Text
            className={`subHeading3 ${disabled ? 'text-gray-700' : 'text-gray-900'}`}
          >{`확인`}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default PetRegistrationScreen;
