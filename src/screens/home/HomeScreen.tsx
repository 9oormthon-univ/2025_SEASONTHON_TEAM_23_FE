import { View, Text, Pressable } from 'react-native';
import { useAuth } from '@/provider/AuthProvider';

const HomeScreen = () => {
  const { logout } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold">홈</Text>
      <Pressable onPress={logout}>
        <Text>로그아웃</Text>
      </Pressable>
    </View>
  );
};

export default HomeScreen;
