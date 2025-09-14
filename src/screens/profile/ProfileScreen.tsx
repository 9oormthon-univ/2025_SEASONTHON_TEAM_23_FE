import {
  Image,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/provider/AuthProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDailyLogs } from '@/hooks/queries/useDailyLog';
import { fetchMyLetters } from '@/services/letters';
import { EMOJIS } from '@/constants/diary/emoji';
import { emojiKeyFromNumber } from '@/utils/calendar/mood';
import { useMyPageSummary } from '@/hooks/queries/useMyPageSummary';
import { useUpsertNickname } from '@/hooks/mutations/useUpsertNickname';
import Icon from '@common/Icon';
import DefaultProfile from '@images/default-profile.png';
import ProfileDog from '@images/profile-dog.png';
import Loader from '@common/Loader';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  // Bottom tab & safe-area heights to keep last item above the tab bar
  const tabBarHeight = useBottomTabBarHeight();
  const { bottom: insetBottom } = useSafeAreaInsets();
  const bottomPadding = tabBarHeight + insetBottom;

  // 탭 상태: 'diary' | 'letter'
  const [tab, setTab] = useState<'diary' | 'letter'>('diary');

  // 일기 데이터
  const userId = user?.userId;
  const {
    data: dailyLogs,
    isLoading: isDailyLogsLoading,
    isError: isDailyLogsError,
    refetch: refetchDailyLogs,
  } = useDailyLogs(userId);
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

  const {
    data: summary,
    refetch: refetchSummary,
    isFetching: isFetchingSummary,
  } = useMyPageSummary(!!user);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(user?.nickname ?? '');
  const { mutate: saveNickname, isPending: isSavingNickname } = useUpsertNickname();

  useEffect(() => {
    // 유저 정보 갱신 시 입력값 초기화
    setNicknameInput(user?.nickname ?? '');
  }, [user?.nickname]);

  const openNicknameModal = useCallback(() => {
    setNicknameInput(user?.nickname ?? '');
    setNicknameModalVisible(true);
  }, [user?.nickname]);

  const onConfirmNickname = useCallback(() => {
    const trimmed = nicknameInput.trim();
    if (!trimmed) {
      Alert.alert('닉네임', '닉네임을 입력해주세요.');
      return;
    }
    saveNickname(trimmed, {
      onSuccess: () => {
        setNicknameModalVisible(false);
      },
      onError: () => {
        Alert.alert('닉네임', '닉네임을 저장하지 못했어요. 다시 시도해주세요.');
      },
    });
  }, [nicknameInput, saveNickname]);
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout(); // 내부에서 /auth/logout 포함
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, isLoggingOut]);

  const confirmLogout = useCallback(() => {
    Alert.alert('로그아웃', '로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '확인', style: 'destructive', onPress: handleLogout },
    ]);
  }, [handleLogout]);

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
  const refreshing =
    isFetchingSummary || isDailyLogsLoading || (tab === 'letter' && lettersLoading);

  const EmptyState = ({ message }: { message: string }) => (
    <View className="mt-16 flex-1 items-center justify-start px-10">
      <Text className="subHeading2B mb-8 text-center text-white">{message}</Text>
      <Image source={ProfileDog} />
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg pt-[27px]">
      <View className="gap-4 px-7">
        {/* 프로필 카드 */}
        <View className="flex-row gap-5" style={{ marginTop: Platform.OS === 'ios' ? -30 : 0 }}>
          <Image source={DefaultProfile} className="h-20 w-20 rounded-xl border border-gray-300" />
          <View className="flex-1 justify-center gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="subHeading1B text-white" numberOfLines={1}>
                {user?.nickname ?? '익명'}
              </Text>
              <View className="flex-row items-center justify-end gap-3">
                <TouchableOpacity
                  hitSlop={8}
                  onPress={openNicknameModal}
                  disabled={isSavingNickname}
                >
                  <Text className="body3 text-gray-600 underline">{`닉네임 수정`}</Text>
                </TouchableOpacity>
                <TouchableOpacity hitSlop={8} onPress={confirmLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? (
                    <View className="w-[43px]">
                      <Loader size="small" />
                    </View>
                  ) : (
                    <Text className="body3 text-gray-600 underline">{`로그아웃`}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-row items-center py-1">
                <Icon name="IcCalendar" size={20} />
                <View className="flex-row items-center gap-0.5">
                  <Text className="body1 !leading-6 text-yellow-200">
                    {summary?.dailyLogCount ?? 0}
                  </Text>
                  <Text className="body1 !leading-6 text-gray-300">일기</Text>
                </View>
              </View>
              <View className="flex-row items-center py-1">
                <Icon name="IcLetter" size={20} />
                <View className="flex-row items-center gap-0.5">
                  <Text className="body1 !leading-6 text-yellow-200">
                    {summary?.letterCount ?? 0}
                  </Text>
                  <Text className="body1 !leading-6 text-gray-300">편지</Text>
                </View>
              </View>
              <View className="flex-row items-center py-1">
                {Platform.OS === 'ios' ? (
                  <Image
                    source={require('@images/mini-star.png')}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                ) : (
                  <View className="px-0.5 ">
                    <Icon name="IcStar" size={14} />
                  </View>
                )}
                <View className="flex-row items-center gap-0.5">
                  <Text className="body1 !leading-6 text-yellow-200">
                    {summary?.tributeCount ?? 0}
                  </Text>
                  <Text className="body1 !leading-6 text-gray-300">위로의 별</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 탭 */}
        <View style={{ marginTop: Platform.OS === 'ios' ? 10 : undefined }}>
          <View className="flex-row items-center justify-center gap-2.5">
            <View className="flex-1">
              <TouchableOpacity
                className="px-11 py-2"
                onPress={() => setTab('diary')}
                activeOpacity={0.8}
              >
                <Text
                  className={`subHeading2B text-center ${tab === 'diary' ? 'text-white' : 'text-gray-600'}`}
                >
                  {`나의 일기`}
                </Text>
              </TouchableOpacity>
              {tab === 'diary' && <View className="h-0.5 w-full rounded-full bg-yellow-200" />}
            </View>
            <View className="flex-1">
              <TouchableOpacity
                className="px-11 py-2"
                onPress={() => setTab('letter')}
                activeOpacity={0.8}
              >
                <Text
                  className={`subHeading2B text-center ${tab === 'letter' ? 'text-white' : 'text-gray-600'}`}
                >
                  {`보낸 편지`}
                </Text>
              </TouchableOpacity>
              {tab === 'letter' && <View className="h-0.5 w-full rounded-full bg-yellow-200" />}
            </View>
          </View>
        </View>
      </View>

      {/* 콘텐츠 */}
      <View className="mt-4 flex-1" style={{ marginTop: Platform.OS === 'ios' ? 8 : undefined }}>
        {tab === 'diary' ? (
          isDailyLogsLoading ? (
            <Loader />
          ) : isDailyLogsError ? (
            <Text className="mt-6 text-center text-error" onPress={() => refetchDailyLogs()}>
              {`일기를 불러오지 못했어요. 다시 시도하려면 눌러주세요.`}
            </Text>
          ) : (
            <FlatList
              data={logs}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item, index }) => {
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
                  <View
                    className={`gap-2 bg-bg-light px-7 py-5 ${index === 0 ? 'border-t' : ''} border-b`}
                    style={{ borderColor: 'black' }}
                  >
                    <View className="flex-row justify-between" style={{ alignItems: 'flex-start' }}>
                      <View
                        className="flex-row gap-2"
                        style={{ flexShrink: 1, flexWrap: 'wrap', alignItems: 'center' }}
                      >
                        <Icon
                          name={EMOJIS[key].icon as any}
                          size={20}
                          fill={colorMap[key] || '#FFFFFF'}
                        />
                        <Text
                          className="body3 text-white"
                          style={{
                            color: colorMap[key] || '#FFFFFF',
                            flexShrink: 1,
                            lineHeight: 16,
                          }}
                        >
                          {emotion}
                        </Text>
                      </View>
                      <Text className="captionSB ml-2 text-gray-300">{item.logDate}</Text>
                    </View>
                    <Text className="body1 text-white" style={{ lineHeight: 20 }}>
                      {item.preview}
                    </Text>
                  </View>
                );
              }}
              contentContainerStyle={{ paddingBottom: bottomPadding }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              ListEmptyComponent={<EmptyState message="오늘의 이야기를 들려주세요." />}
            />
          )
        ) : lettersLoading ? (
          <Loader />
        ) : lettersError ? (
          <Text className="mt-6 text-center text-error" onPress={loadLetters}>
            {`${lettersError} 다시 시도하려면 눌러주세요.`}
          </Text>
        ) : (
          <FlatList
            data={letters}
            keyExtractor={(item, idx) => `${item.id}-${idx}`}
            renderItem={({ item, index }) => (
              <View
                className={`gap-2 bg-bg-light px-7 py-5 ${index === 0 ? 'border-t' : ''} border-b`}
                style={{ borderColor: 'black' }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    {Platform.OS === 'ios' ? (
                      <Image
                        source={require('@images/mini-star.png')}
                        style={{ width: 18, height: 18 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Icon name="IcStar" size={18} />
                    )}
                    <Text className="body3 text-white">{item.tributeCount ?? 0}</Text>
                  </View>
                  <Text className="captionSB ml-2 text-gray-300">
                    {item.createdAt?.slice(0, 10) ?? ''}
                  </Text>
                </View>
                <Text className="body1 text-white" style={{ lineHeight: 20 }}>
                  {item.content}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: bottomPadding }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={<EmptyState message="편지로 추억을 나누어 봐요." />}
          />
        )}
      </View>
      {/* 닉네임 수정 모달 */}
      <Modal
        visible={nicknameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !isSavingNickname && setNicknameModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/60 px-8">
          <View className="w-full rounded-2xl bg-[#1F2A3C] p-6">
            <Text className="subHeading2B mb-4 text-white">
              닉네임 {user?.nickname ? '수정' : '설정'}
            </Text>
            <TextInput
              value={nicknameInput}
              onChangeText={setNicknameInput}
              placeholder="닉네임을 입력하세요"
              placeholderTextColor="#7A8699"
              maxLength={20}
              autoFocus
              className="body1 rounded-lg bg-[#273246] px-4 text-white"
              style={{
                lineHeight: 18,
                height: 44,
                paddingVertical: 10,
                textAlignVertical: 'center',
              }}
            />
            <Text className="caption mt-2 text-gray-400">최대 20자 • 공백 양끝 자동 제거</Text>
            <View className="mt-6 flex-row items-center justify-end gap-4">
              <TouchableOpacity
                disabled={isSavingNickname}
                onPress={() => setNicknameModalVisible(false)}
              >
                <Text className="captionSB text-gray-300 underline">{`취소`}</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={isSavingNickname} onPress={onConfirmNickname}>
                {isSavingNickname ? (
                  <View className="w-5 flex-row items-center justify-center gap-2">
                    <Loader size="small" />
                  </View>
                ) : (
                  <Text className="captionSB text-yellow-200 underline">확인</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
