import { Pressable, View, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IcKakaoLogo from '@icons/ic-kakao-logo.svg';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';

const OnboardingScreen = () => {
  const { loading, onKakaoPress } = useKakaoLogin();

  return (
    <SafeAreaView className="flex-1 items-center gap-[95px] px-7 pt-7">
      <View className="flex-col gap-[52px]">
        <Image source={require('@images/img-onboarding-ex.png')} />
        <View className="flex items-center gap-3">
          <View className="flex w-full gap-5">
            <Pressable
              onPress={onKakaoPress}
              disabled={loading}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              className="flex-row items-center justify-center gap-4 rounded-[20px] bg-[#FAE301] py-4 color-[#391B1B]"
            >
              <IcKakaoLogo />
              <Text className="subHeading3">카카오 로그인</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <Text className="captionB color-gray-300">{`Developed By Team Petfarewell`}</Text>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
