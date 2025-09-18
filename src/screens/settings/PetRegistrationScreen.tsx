import { Pressable, ScrollView, Text, View } from 'react-native';
import { keepAllKorean } from '@/utils/keepAll';
import SelectBox from '@common/SelectBox';
import { PERSONALITY_CONFLICTS, PERSONALITY_OPTIONS, SPECIES_OPTIONS } from '@/types/select';
import Input from '@common/Input';
import Loader from '@common/Loader';
import { usePetRegistration } from '@/hooks/pets/usePetRegistration';
import { showConflictAlert } from '@/utils/selectConflict';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList, RootStackParamList } from '@/types/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { Pet } from '@/types/pets';

const PetRegistrationScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList & RootStackParamList>>();
  const qc = useQueryClient();

  const route = useRoute<any>();
  const pet: Pet | undefined = route?.params?.pet; // 편집용 초기값
  const isFromProfile = route.name === 'PetRegistrationInProfile';
  const padding = isFromProfile ? 'pb-16 pt-10' : 'pb-[90px] pt-5';

  const {
    fields: { petName, selectSpecies, selectPersonality },
    setPetName,
    handleSpeciesChange,
    handlePersonalityChange,
    disabled,
    isPending,
    onSubmit,
  } = usePetRegistration({
    initialPet: pet,
    onSuccessNav: async () => {
      if (isFromProfile) {
        // 설정에서 온 경우: 뒤로 가기
        navigation.goBack();
      } else {
        // 루트(최초 등록) 플로우: Tabs는 아직 네비게이터에 없음
        // -> myPets를 최신화해 needsPet=false가 되면 RootNavigator가 Tabs로 재구성됨
        await qc.invalidateQueries({ queryKey: ['myPets'] });
        // 여기서 navigate/reset 하지 않음!
      }
    },
  });

  return (
    <ScrollView className="bg-bg">
      <View className={`gap-32 px-7 ${padding}`}>
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
