import { Image, Text, View, TouchableOpacity, FlatList, SafeAreaView, StatusBar, RefreshControl } from 'react-native';
import { useAuth } from '@/provider/AuthProvider';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDailyLogs } from '@/hooks/queries/useDailyLog';
import { fetchMyLetters } from '@/services/letters';
import { EMOJIS } from '@/constants/diary/emoji';
import { emojiKeyFromNumber } from '@/utils/calendar/mood';
import { useMyPageSummary } from '@/hooks/queries/useMyPageSummary';
import Icon from '@common/Icon';
import DefaultProfile from '@images/default-profile.png';
import ProfileDog from '@images/profile-dog.png';

const ProfileScreen = () => {
  const { user } = useAuth();

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

  const { data: summary, refetch: refetchSummary, isFetching: isFetchingSummary } = useMyPageSummary(!!user);

  // 스크린 포커스 시 최신 데이터 갱신
  useFocusEffect(
    useCallback(() => {
      if (user) {
        refetchSummary();
        refetchDailyLogs();
        if (tab === 'letter') {
          loadLetters();
        }
      }
    }, [user, tab, refetchSummary, refetchDailyLogs, loadLetters])
  );

  // Pull To Refresh 처리
  const onRefresh = useCallback(() => {
    refetchSummary();
    refetchDailyLogs();
    if (tab === 'letter') {
      loadLetters();
    }
  }, [refetchSummary, refetchDailyLogs, loadLetters, tab]);
  const refreshing = isFetchingSummary || isDailyLogsLoading || (tab === 'letter' && lettersLoading);

  const EmptyState = ({ message }: { message: string }) => (
    <View className="flex-1 items-center justify-start mt-16 px-10">
      <Text className="subHeading2B text-white text-center mb-8">{message}</Text>
      <Image source={ProfileDog}/>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#121826]">
      <StatusBar barStyle="light-content" />
      {/* Header (간단한 타이틀) - 네비게이션 헤더를 쓰고 있다면 제거 가능 */}
      <View className="px-6 pt-2 pb-4 flex-row items-center justify-between">
        <Text className="subHeading1B text-white">프로필</Text>
        {/* 설정 아이콘 자리 (향후 설정 화면 라우팅) */}
        <TouchableOpacity className="p-2" hitSlop={8}>
          <Icon name="IcVerticalDots" size={20} fill="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 프로필 카드 */}
      <View className="mx-6 rounded-2xl bg-[#1F2A3C] px-6 py-6 flex-row items-center gap-5">
          <View>
            <Image source={DefaultProfile} className="w-20 h-20" />
          </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="subHeading1B text-white" numberOfLines={1}>{user?.nickname ?? '익명'}</Text>
            <TouchableOpacity hitSlop={8} className="ml-2">
              <Icon name="IcPaw" size={22} fill="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View className="flex-row mt-4 gap-5">
            <View className="flex-row items-center gap-1">
              <Icon name="IcCalendar" size={20} />
              <Text className="captionB text-[#F3DE77]">{summary?.dailyLogCount ?? 0}</Text>
              <Text className="captionSB text-gray-300 ml-0.5">일기</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Icon name="IcLetter" size={20} />
              <Text className="captionB text-[#F3DE77]">{summary?.letterCount ?? 0}</Text>
              <Text className="captionSB text-gray-300 ml-0.5">편지</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Icon name="IcFlower" size={20}/>
              <Text className="captionB text-[#F3DE77]">{summary?.tributeCount ?? 0}</Text>
              <Text className="captionSB text-gray-300 ml-0.5">헌화</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 탭 */}
  <View className="mt-8 px-6">
        <View className="flex-row">
          <TouchableOpacity className="flex-1 pb-2" onPress={() => setTab('diary')} activeOpacity={0.8}>
    <Text className={`text-center subHeading3 ${tab === 'diary' ? 'text-white' : 'text-gray-500'}`}>나의 일기</Text>
    {tab === 'diary' && <View className="h-1 rounded-full mt-2 mx-12" style={{ backgroundColor: '#D6B654' }} />}
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 pb-2" onPress={() => setTab('letter')} activeOpacity={0.8}>
    <Text className={`text-center subHeading3 ${tab === 'letter' ? 'text-white' : 'text-gray-500'}`}>보낸 편지</Text>
    {tab === 'letter' && <View className="h-1 rounded-full mt-2 mx-12" style={{ backgroundColor: '#D6B654' }} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* 콘텐츠 */}
      <View className="flex-1 mt-4">
        {tab === 'diary' ? (
          isDailyLogsLoading ? (
            <Text className="text-center text-gray-300 mt-6">불러오는 중...</Text>
          ) : isDailyLogsError ? (
            <Text className="text-center text-error mt-6" onPress={() => refetchDailyLogs()}>일기를 불러오지 못했어요. 다시 시도하려면 눌러주세요.</Text>
          ) : (
            <FlatList
              data={logs}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                const key = emojiKeyFromNumber(item.mood);
                const emotion = EMOJIS[key]?.emotion || '';
                const colorMap: Record<string, string> = {
                  best: '#A6EB7C',
                  good: '#8FC3F6',
                  soso: '#F3DE77',
                  sad: '#CECECE',
                  bad: '#808080',
                };
                return (
                  <View className="mx-6 mb-4 rounded-2xl bg-[#1F2A3C] px-5 py-4">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-row items-center gap-2 flex-1 pr-2">
                        <Icon name={EMOJIS[key].icon as any} size={18} fill={colorMap[key] || '#FFFFFF'} />
                        <Text className="body2" style={{ color: colorMap[key] || '#FFFFFF' }}>{emotion}</Text>
                      </View>
                      <Text className="captionSB text-gray-400 ml-2">{item.logDate}</Text>
                    </View>
                    <Text className="body1 text-white mt-3" numberOfLines={2}>{item.preview}</Text>
                  </View>
                );
              }}
              contentContainerStyle={{ paddingTop: 4, paddingBottom: 40 }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              ListEmptyComponent={<EmptyState message="오늘의 이야기를 들려주세요." />}
            />
          )
        ) : (
          lettersLoading ? (
            <Text className="text-center text-gray-300 mt-6">불러오는 중...</Text>
          ) : lettersError ? (
            <Text className="text-center text-error mt-6" onPress={loadLetters}>{lettersError} 다시 시도하려면 눌러주세요.</Text>
          ) : (
            <FlatList
              data={letters}
              keyExtractor={(item, idx) => `${item.id}-${idx}`}
              renderItem={({ item, index }) => (
                <View className={`bg-[#1F2A3C] px-6 py-4 ${index === 0 ? 'border-t' : ''} border-b`} style={{ borderColor: '#313846' }}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <Icon name="IcFlower" size={18} fill="#D6B654" />
                      <Text className="captionB text-white">{item.tributeCount ?? 0}</Text>
                    </View>
                    <Text className="captionSB text-gray-400 ml-2">{item.createdAt?.slice(0,10) ?? ''}</Text>
                  </View>
                  <Text className="body1 text-white mt-4" numberOfLines={2}>{item.content}</Text>
                </View>
              )}
              contentContainerStyle={{  paddingTop: 4, paddingBottom: 40 }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              ListEmptyComponent={<EmptyState message="편지로 추억을 나누어 봐요." />}
            />
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
