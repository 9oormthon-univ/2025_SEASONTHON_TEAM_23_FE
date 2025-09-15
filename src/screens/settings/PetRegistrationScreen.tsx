import { Pressable, ScrollView, Text, View } from 'react-native';
import { keepAllKorean } from '@/utils/keepAll';
import SelectBox from '@common/SelectBox';
import { useState } from 'react';
import { PERSONALITY_OPTIONS, SPECIES_OPTIONS } from '@/types/select';
import Input from '@common/Input';

const PetRegistrationScreen = () => {
  const [petName, setPetName] = useState('');
  const [selectSpecies, setSelectSpecies] = useState<string[]>([]);
  const [selectPersonality, setSelectPersonality] = useState<string[]>([]);

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
            />
          </View>
        </View>
        <Pressable className="items-center justify-center rounded-[20px] bg-yellow-200 py-5">
          <Text className="subHeading3 text-gray-900">{`확인`}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default PetRegistrationScreen;
