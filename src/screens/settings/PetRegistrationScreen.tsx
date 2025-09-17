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

const PetRegistrationScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList & RootStackParamList>>();
  const {
    fields: { petName, selectSpecies, selectPersonality },
    setPetName,
    handleSpeciesChange,
    handlePersonalityChange,
    disabled,
    isPending,
    onSubmit,
  } = usePetRegistration({
    onSuccessNav: () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Tabs' as never }] });
      }
    },
  });

  const route = useRoute<any>();
  const isFromProfile = route.name === 'PetRegistrationInProfile';
  const padding = isFromProfile ? 'pb-16 pt-10' : 'pb-[90px] pt-5';

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
