import { Pressable, View, Text, ScrollView, Platform, Image } from 'react-native';
import IcKakaoLogo from '@icons/ic-kakao-logo.svg';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';
import OnboardingCarousel from '@/components/onboarding/OnboardingCarousel';
import { SafeAreaView } from 'react-native-safe-area-context';

const slides = [
  require('@images/img-onboarding-1.png'),
  require('@images/img-onboarding-2.png'),
  require('@images/img-onboarding-3.png'),
  require('@images/img-onboarding-4.png'),
];

const OnboardingScreen = () => {
  const { loading, onKakaoPress } = useKakaoLogin();

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className={`w-full items-center ${Platform.OS === 'android' ? 'gap-7' : 'gap-[35px]'}`}
        >
          <View className="items-center gap-7">
            <Image
              source={require('@images/splash-logo.png')}
              resizeMode="contain"
              className="h-20 w-[136px]"
            />
            <OnboardingCarousel images={slides} interval={5000} />
          </View>
          <View className="w-full flex-row overflow-hidden px-7">
            <Pressable
              onPress={onKakaoPress}
              disabled={loading}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              className="w-full flex-row items-center justify-center gap-4 rounded-2xl bg-[#FAE301] py-4 color-[#391B1B]"
            >
              <IcKakaoLogo />
              <Text className="subHeading3 text-center">{`카카오 로그인`}</Text>
            </Pressable>
          </View>
        </View>
        <Text className="captionB absolute bottom-12 w-full text-center text-[#64696F]">{`Developed By Team 펫어웰`}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
