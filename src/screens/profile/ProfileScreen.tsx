import { Image, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { useAuth } from '@/provider/AuthProvider';
import { useMyPageSummary } from '@/hooks/queries/useMyPageSummary';

const ProfileScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, isLoading, isError, refetch } = useMyPageSummary(!!user);

  const profileImage = user?.profileImageUrl;

  return (
    <View className="flex-1 bg-white">
      <View className="items-center pt-10 pb-6">
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            className="w-24 h-24 rounded-full bg-gray-200"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
            <Text className="captionB text-gray-500">No Image</Text>
          </View>
        )}
        <Text className="subHeading1B mt-4 text-gray-900">{user?.nickname ?? '익명'}</Text>
      </View>

      <View className="mx-6 rounded-2xl border border-gray-200 p-5">
        {isLoading ? (
          <Text className="bodyB text-gray-600">불러오는 중...</Text>
        ) : isError ? (
          <Text className="bodyB text-red-500" onPress={() => refetch()}>
            정보를 불러오지 못했어요. 다시 시도하려면 눌러주세요.
          </Text>
        ) : (
          <View className="flex-row items-center justify-between">
            <Pressable className="flex-1 items-center" onPress={() => navigation.navigate('MyDailyLogs')}>
              <Text className="captionB text-gray-500">일기</Text>
              <Text className="title2B text-gray-900 mt-1">{data?.dailyLogCount ?? 0}</Text>
            </Pressable>
            <View className="w-px h-10 bg-gray-200" />
            <Pressable className="flex-1 items-center" onPress={() => navigation.navigate('MyLetters')}>
              <Text className="captionB text-gray-500">편지</Text>
              <Text className="title2B text-gray-900 mt-1">{data?.letterCount ?? 0}</Text>
            </Pressable>
            <View className="w-px h-10 bg-gray-200" />
            <View className="flex-1 items-center">
              <Text className="captionB text-gray-500">헌화</Text>
              <Text className="title2B text-gray-900 mt-1">{data?.tributeCount ?? 0}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProfileScreen;
