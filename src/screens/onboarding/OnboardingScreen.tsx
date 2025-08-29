import { useAuth } from '@/provider/AuthProvider';
import { Pressable, View, Text } from 'react-native';
import { user } from '@/mocks/auth';

const OnboardingScreen = () => {
  const { setUser } = useAuth();

  const onKakaoPress = async () => {
    // await login();
    setUser(user);
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Pressable
        onPress={onKakaoPress}
        android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
        className=" rounded-[12px] bg-[#fee500] px-8 py-4"
      >
        <Text>카카오톡으로 로그인</Text>
      </Pressable>
    </View>
  );
};

export default OnboardingScreen;
