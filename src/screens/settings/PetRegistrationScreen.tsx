import { Pressable, ScrollView, Text, View } from 'react-native';
import { keepAllKorean } from '@/utils/keepAll';
import SelectBox from '@common/SelectBox';
import { PERSONALITY_CONFLICTS, PERSONALITY_OPTIONS, SPECIES_OPTIONS } from '@/types/select';
import Input from '@common/Input';
import Loader from '@common/Loader';
import { usePetRegistration } from '@/hooks/pets/usePetRegistration';
import { showConflictAlert } from '@/utils/selectConflict';

const PetRegistrationScreen = () => {
  const {
    fields: { petName, selectSpecies, selectPersonality },
    setPetName,
    handleSpeciesChange,
    handlePersonalityChange,
    disabled,
    isPending,
    onSubmit,
  } = usePetRegistration();

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
              onChange={handleSpeciesChange}
              placeholder="종을 선택해주세요."
              maxSelected={1}
              closeOnSelect
            />
            <SelectBox
              label="성격"
              items={PERSONALITY_OPTIONS}
              values={selectPersonality}
              onChange={handlePersonalityChange}
              placeholder="성격을 선택해주세요."
              conflicts={PERSONALITY_CONFLICTS}
              conflictStrategy="block"
              onConflict={showConflictAlert}
            />
          </View>
        </View>
        <Pressable
          disabled={disabled}
          onPress={onSubmit}
          className={`${disabled ? 'bg-gray-500' : 'bg-yellow-200'} items-center justify-center rounded-[20px] py-5`}
        >
          {isPending && <Loader />}
          <Text
            className={`subHeading3 ${disabled ? 'text-white' : 'text-gray-900'}`}
          >{`확인`}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default PetRegistrationScreen;
