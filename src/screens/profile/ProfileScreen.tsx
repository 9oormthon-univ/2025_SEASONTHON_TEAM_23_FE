import { Image, Text, View, Pressable, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from '@/provider/AuthProvider';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDailyLogs } from '@/hooks/queries/useDailyLog';
import { fetchMyLetters } from '@/services/letters';
import { formatRelativeTime } from '@/utils/relativeTime';
import { EMOJIS } from '@/constants/diary/emoji';
import { emojiKeyFromNumber } from '@/utils/calendar/mood';
import { fetchMyPageSummary } from '@/services/mypage';
import { useMyPageSummary } from '@/hooks/queries/useMyPageSummary';

const ProfileScreen = () => {
  const { user } = useAuth();

  const profileImage = user?.profileImageUrl;

  // 탭 상태: 'diary' | 'letter'
  const [tab, setTab] = useState<'diary' | 'letter'>('diary');

  // 일기 데이터
  const userId = user?.userId;
  const { data: dailyLogs, isLoading: isDailyLogsLoading, isError: isDailyLogsError, refetch: refetchDailyLogs } = useDailyLogs(userId);
  const logs = useMemo(() => dailyLogs ?? [], [dailyLogs]);

  // 편지 데이터
  const [letters, setLetters] = useState<any[]>([]);
  const [lettersLoading, setLettersLoading] = useState(false);
  const [lettersError, setLettersError] = useState<string | null>(null);
  const loadLetters = useCallback(async () => {
    setLettersLoading(true);
    setLettersError(null);
    try {
      const res = await fetchMyLetters(0, 100);
      const arr = (res as any)?.data ?? res;
      const list = Array.isArray(arr) ? arr : (arr?.content ?? []);
      setLetters(list);
    } catch {
      setLettersError('편지를 불러오지 못했어요.');
    } finally {
      setLettersLoading(false);
    }
  }, []);
  useEffect(() => {
    if (tab === 'letter') {
      loadLetters();
    }
  }, [tab, loadLetters]);

  const { data: summary } = useMyPageSummary(!!user);

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
        <Text className=" text-gray-500">{summary?.dailyLogCount} 일기 </Text>
        <Text className=" text-gray-500">{summary?.letterCount} 편지</Text>
        <Text className=" text-gray-500">{summary?.tributeCount} 헌화</Text>

      {/* 탭 버튼 */}
      <View style={{ flexDirection: 'row', marginHorizontal: 24, marginBottom: 8 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setTab('diary')}>
          <Text style={{ textAlign: 'center', fontWeight: tab === 'diary' ? 'bold' : 'normal' }}>나의 일기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setTab('letter')}>
          <Text style={{ textAlign: 'center', fontWeight: tab === 'letter' ? 'bold' : 'normal' }}>보낸 편지</Text>
        </TouchableOpacity>
      </View>

      {/* 탭 컨텐츠 */}
      <View style={{ flex: 1 }}>
        {tab === 'diary' ? (
          isDailyLogsLoading ? (
            <Text style={{ textAlign: 'center', marginTop: 24 }}>불러오는 중...</Text>
          ) : isDailyLogsError ? (
            <Text style={{ textAlign: 'center', marginTop: 24 }} onPress={() => refetchDailyLogs()}>
              일기를 불러오지 못했어요. 다시 시도하려면 눌러주세요.
            </Text>
          ) : (
            <FlatList
              data={logs}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <View style={{ marginHorizontal: 16, marginVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12 }}>
                  <Text style={{ color: '#6b7280', fontSize: 12 }}>{item.logDate}</Text>
                  <Text style={{ fontWeight: 'bold', marginTop: 4 }}>
                    {(() => {
                      const key = emojiKeyFromNumber(item.mood);
                      return EMOJIS[key]?.emotion || '';
                    })()}
                  </Text>
                  <Text style={{ color: '#374151', marginTop: 8 }} numberOfLines={2}>{item.preview}</Text>
                </View>
              )}
              contentContainerStyle={{ paddingVertical: 12 }}
              ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>오늘의 이야기를 나누어 주세요.</Text>}
            />
          )
        ) : (
          lettersLoading ? (
            <Text style={{ textAlign: 'center', marginTop: 24 }}>불러오는 중...</Text>
          ) : lettersError ? (
            <Text style={{ textAlign: 'center', marginTop: 24 }} onPress={loadLetters}>
              {lettersError} 다시 시도하려면 눌러주세요.
            </Text>
          ) : (
            <FlatList
              data={letters}
              keyExtractor={(item, idx) => `${item.id}-${idx}`}
              renderItem={({ item }) => (
                <View style={{ marginHorizontal: 16, marginVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12 }}>
                  <Text style={{ color: '#111827' }}>{item.content}</Text>
                  <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>
                    {item.createdAt ? formatRelativeTime(item.createdAt) : ''} · 헌화 {item.tributeCount ?? 0}
                  </Text>
                </View>
              )}
              contentContainerStyle={{ paddingVertical: 12 }}
              ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>편지로 추억을 나누어 봐요.</Text>}
            />
          )
        )}
      </View>
    </View>
  );
};

export default ProfileScreen;
