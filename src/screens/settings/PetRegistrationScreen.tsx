import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Loader from '@common/Loader';
import { usePetRegistration } from '@/hooks/pets/usePetRegistration';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList, RootStackParamList } from '@/types/navigation';
import type { Pet } from '@/types/pets';
import PetInfoStep from '@/components/settings/PetInfoStep';
import { useMemo, useState } from 'react';
import PetPersonalityStep from '@/components/settings/PetPersonalityStep';
import ProgressBar from '@/components/settings/ProgressBar';
import { keepAllKorean } from '@/utils/keepAll';
import { SafeAreaView } from 'react-native-safe-area-context';

const PetRegistrationScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList & RootStackParamList>>();
  const [step, setStep] = useState<1 | 2>(1);

  const route = useRoute<any>();
  const pet: Pet | undefined = route?.params?.pet; // 편집용 초기값
  const isFromProfile = route.name === 'PetRegistrationInProfile';
  const padding = isFromProfile ? 'pb-16' : 'pb-[90px]';
  const buttonIsAbsolute = isFromProfile ? '' : 'absolute inset-x-7';

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
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Tabs' as never }] }));
      }
    },
  });

  // 타이틀
  const title =
    step === 1 ? '반려동물의\n기본정보를 입력해주세요.' : '반려동물\n성격을 알려주세요.';

  // 1단계(이름+종) 완료 가능 조건
  const canNext = useMemo(
    () => petName.trim().length > 0 && selectSpecies.length === 1,
    [petName, selectSpecies]
  );

  const ctaDisabled = step === 1 ? !canNext || isPending : disabled;

  const handlePrimary = () => {
    if (step === 1) {
      if (!canNext) return;
      setStep(2);
      return;
    }
    // step2: 최종 제출
    onSubmit();
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-7">
        <ProgressBar step={step} total={2} />
        <View className="gap-16">
          <View className={`flex-1 gap-[52px] pb-16 pt-5 ${padding}`}>
            <Text className="heading2SB !leading-[42px] text-white">{keepAllKorean(title)}</Text>

            {step === 1 ? (
              <PetInfoStep
                petName={petName}
                setPetName={setPetName}
                selectSpecies={selectSpecies}
                handleSpeciesChange={handleSpeciesChange}
              />
            ) : (
              <PetPersonalityStep
                selectPersonality={selectPersonality}
                handlePersonalityChange={handlePersonalityChange}
              />
            )}
          </View>
          <View className={`${buttonIsAbsolute} bottom-14 flex-row items-center gap-3`}>
            {step === 2 && (
              <TouchableOpacity
                onPress={() => setStep(1)}
                activeOpacity={0.8}
                className="w-full flex-1 items-center justify-center rounded-[20px] bg-gray-500 py-5"
              >
                <Text className="subHeading3 text-white">{`이전`}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={ctaDisabled}
              onPress={handlePrimary}
              activeOpacity={0.8}
              className={`${ctaDisabled ? 'bg-gray-500' : 'bg-yellow-200'} w-full flex-1 items-center justify-center rounded-[20px] py-5`}
            >
              {isPending && <Loader />}
              <Text
                className={`subHeading3 ${ctaDisabled ? 'text-white' : 'text-gray-900'}`}
              >{`확인`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetRegistrationScreen;
