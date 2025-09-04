import { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAuth } from '@/provider/AuthProvider';
import { useDailyLogs } from '@/hooks/queries/useDailyLog';

const MyDailyLogsScreen = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const { data, isLoading, isError, refetch } = useDailyLogs(userId);

  const logs = useMemo(() => data ?? [], [data]);

  if (isLoading) return <View className="flex-1 items-center justify-center bg-white"><Text>불러오는 중...</Text></View>;
  if (isError) return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text onPress={() => refetch()}>일기를 불러오지 못했어요. 다시 시도하려면 눌러주세요.</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={logs}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View className="mx-4 my-2 rounded-xl border border-gray-200 p-4">
            <Text className="captionB text-gray-500">{item.logDate}</Text>
            <Text className="subHeading3 text-gray-900 mt-1">{item.topic}</Text>
            <Text className="bodyB text-gray-700 mt-2" numberOfLines={2}>{item.preview}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">작성한 일기가 없습니다.</Text>}
      />
    </View>
  );
};

export default MyDailyLogsScreen;
