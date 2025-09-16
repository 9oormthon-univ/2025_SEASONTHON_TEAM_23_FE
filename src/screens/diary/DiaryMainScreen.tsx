import { View, Text, Pressable, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/provider/AuthProvider';
import { useDailyLogs } from '@/hooks/queries/useDailyLog';
import type { DiaryStackParamList, RootStackParamList } from '@/types/navigation';
import Icon from '@common/Icon';
import EmotionCalendar from '@diary/EmotionCalendar';
import Loader from '@common/Loader';
import { useDailyTopic } from '@/hooks/queries/useDailyTopic';
import { keepAllKorean } from '@/utils/keepAll';
import { useCallback, useLayoutEffect } from 'react';
import { setHeaderExtras } from '@/types/Header';
import { useQueryClient } from '@tanstack/react-query';
import { localISODate, todayISO } from '@/utils/calendar/date';
import type { StackNavigationProp } from '@react-navigation/stack';

const DiaryMainScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DiaryStackParamList>>();
  const rootNavigaton = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { user } = useAuth();
  const userId = user!.userId;

  const qc = useQueryClient();
  useFocusEffect(
    useCallback(() => {
      qc.invalidateQueries({ queryKey: ['daily-logs', userId] });
      qc.refetchQueries({ queryKey: ['daily-logs', userId] });
    }, [qc, userId])
  );

  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      title: '감정기록',
      hasBack: true,
      hasButton: true,
      icon: 'IcNotification',
      onBack: () => {
        if (navigation.canGoBack()) navigation.goBack();
        navigation.getParent()?.navigate('Tabs', { screen: 'Home' });
      },
      onPress: () => rootNavigaton.navigate('NotificationList'),
    });
  }, [navigation]);
  const { byDate, isLoading: logIsLoading } = useDailyLogs(userId);
  const { data, isLoading: topicIsLoading, isError, refetch } = useDailyTopic();
  const topicText = isError
    ? '오늘의 주제를 불러오지 못했어요.'
    : (data?.topic ?? '오늘의 주제가 없습니다.');

  const handleSelectDate = (iso: string) => {
    const log = byDate[iso];
    if (log) {
      navigation.navigate('DiaryByDate', { logId: log.id });
    } else {
      navigation.navigate('DiaryWrite', { topic: topicText });
    }
  };

  const todayLog = byDate[localISODate(todayISO())];

  return (
    <ScrollView className="bg-bg">
      <View className="gap-7 px-7 pb-11 pt-8">
        <View className="relative items-center gap-5 overflow-hidden rounded-[20px] bg-bg-light px-6 py-5">
          {topicIsLoading && <Loader />}
          <View className="gap-4">
            <View className="items-center gap-[2px]">
              <Icon name="IcPaw" size={24} fill="white" />
              <Text className="body2 text-white">{`오늘의 질문`}</Text>
            </View>
            {topicIsLoading ? null : isError ? (
              <View className="overflow-hidden rounded-xl">
                <Pressable
                  onPress={() => refetch()}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                  className="items-center"
                >
                  <Text className="subHeading3 px-9 py-2 text-center text-error">⚠️ 다시 시도</Text>
                </Pressable>
              </View>
            ) : (
              <Text className="subHeading3 text-center text-white">{keepAllKorean(topicText)}</Text>
            )}
          </View>
          <View className="overflow-hidden rounded-xl">
            <Pressable
              onPress={() => {
                todayLog
                  ? navigation.navigate('DiaryByDate', { logId: todayLog.id })
                  : navigation.navigate('DiaryWrite', { topic: topicText });
              }}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              className="flex-row items-center gap-1 bg-yellow-200 px-9 py-2"
            >
              <Icon name="IcEdit" size={24} fill="#121826" />
              <Text className="body1 leading-[1.6] text-bg">{`일기 쓰러가기`}</Text>
            </Pressable>
          </View>
        </View>
        <View>
          {logIsLoading && <Loader />}
          <EmotionCalendar userId={userId} onSelectDate={handleSelectDate} />
        </View>
      </View>
    </ScrollView>
  );
};

export default DiaryMainScreen;
