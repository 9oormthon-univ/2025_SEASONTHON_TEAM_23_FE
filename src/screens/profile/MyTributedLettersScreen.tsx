import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { fetchMyLetters } from '@/services/letters';
import { formatRelativeTime } from '@/utils/relativeTime';
import { useMyPageSummary } from '@/hooks/queries/useMyPageSummary';

// Note: If backend provides a dedicated endpoint like /tributes/me/letters, prefer that.
// For now, we filter my letters where tributeCount > 0.

const MyTributedLettersScreen = () => {
  const [letters, setLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useMyPageSummary();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMyLetters(0, 100);
      const arr = (res as any)?.data ?? res;
      const list = Array.isArray(arr) ? arr : (arr?.content ?? []);
      const filtered = list.filter((l: any) => (l.tributeCount ?? 0) > 0);
      setLetters(filtered);
    } catch {
      setError('편지를 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 요약 정보 기준으로 받은 헌화가 있을 때만 로드
  useEffect(() => {
    if (summaryLoading || summaryError) return;
    if ((summary?.tributeCount ?? 0) > 0) {
      void load();
    } else {
      setLoading(false);
      setLetters([]);
    }
  }, [summary?.tributeCount, summaryLoading, summaryError, load]);

  if (summaryLoading)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>불러오는 중...</Text>
      </View>
    );
  if (summaryError)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text onPress={() => refetchSummary()}>요약 정보를 불러오지 못했어요. 다시 시도하려면 눌러주세요.</Text>
      </View>
    );

  // 받은 헌화가 없는 경우(요약값 0)
  if ((summary?.tributeCount ?? 0) === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600">받은 헌화가 있는 편지가 없습니다.</Text>
      </View>
    );
  }

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>불러오는 중...</Text>
      </View>
    );
  if (error)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text onPress={() => load()}>{error} 다시 시도하려면 눌러주세요.</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={letters}
        keyExtractor={(item, idx) => `${item.id}-${idx}`}
        renderItem={({ item }) => (
          <View className="mx-4 my-2 rounded-xl border border-gray-200 p-4">
            <Text className="bodyB text-gray-900">{item.content}</Text>
            <Text className="captionB text-gray-500 mt-2">
              {item.createdAt ? formatRelativeTime(item.createdAt) : ''} · 헌화 {item.tributeCount ?? 0}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">받은 헌화가 있는 편지가 없습니다.</Text>}
      />
    </View>
  );
};

export default MyTributedLettersScreen;
