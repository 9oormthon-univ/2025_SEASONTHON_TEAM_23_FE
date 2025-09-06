import { Pressable, View, Image, Text, ScrollView } from 'react-native';
import IcKakaoLogo from '@icons/ic-kakao-logo.svg';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';

const OnboardingScreen = () => {
  const { loading, onKakaoPress } = useKakaoLogin();

  return (
    <ScrollView className="bg-bg">
      <View className="items-center gap-10 px-12 pb-[50px] pt-9">
        <View className="gap-[80px]">
          <Image source={require('@images/img-onboarding.png')} />
          <View className="flex-row gap-3 overflow-hidden">
            <Pressable
              onPress={onKakaoPress}
              disabled={loading}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              className="w-full flex-row items-center justify-center gap-4 rounded-[20px] bg-[#FAE301] py-4 color-[#391B1B]"
            >
              <IcKakaoLogo />
              <Text className="subHeading3 text-center">카카오 로그인</Text>
            </Pressable>
          </View>
        </View>
        <Text className="captionB color-gray-500">{`Developed By Team Petfarewell`}</Text>
      </View>
    </ScrollView>
  );
};

export default OnboardingScreen;
