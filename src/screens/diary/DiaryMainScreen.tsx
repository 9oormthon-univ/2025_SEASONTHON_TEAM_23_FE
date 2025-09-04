import { View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/provider/AuthProvider';
import { useDailyLogs } from '@/hooks/queries/useDailyLog';
import type { DiaryStackParamList } from '@/types/navigation';
import Icon from '@common/Icon';
import EmotionCalendar from '@diary/EmotionCalendar';
import Loader from '@common/Loader';
import { useDailyTopic } from '@/hooks/queries/useDailyTopic';
import { keepAllKorean } from '@/utils/keepAll';
import { useLayoutEffect } from 'react';
import { setHeaderExtras } from '@/types/Header';

const DiaryMainScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DiaryStackParamList>>();
  const { user } = useAuth();
  const userId = user!.userId;

  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      title: '오늘의 일기',
      hasBack: true,
      hasButton: true,
      icon: 'IcNotification',
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

  return (
    <ScrollView>
      <View className="gap-7 bg-gray-50 pb-6 pt-8">
        <View className="relative mx-7 items-center gap-5 overflow-hidden rounded-[20px] bg-white px-6 py-5">
          {topicIsLoading && <Loader />}
          <View className="gap-4">
            <View className="items-center">
              <Icon name="IcPaw" size={24} fill="#343434" />
              <Text className="body2 text-[#343434]">{`오늘의 질문`}</Text>
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
              <Text className="subHeading3 text-center text-gray-900">
                {keepAllKorean(topicText)}
              </Text>
            )}
          </View>
          <Pressable
            onPress={() => navigation.navigate('DiaryWrite', { topic: topicText })}
            className="flex-row items-center gap-1 rounded-xl bg-primary px-9 py-2"
          >
            <Icon name="IcEdit" size={24} fill="white" />
            <Text className="body1 leading-[1.6] text-white">{`일기 쓰러가기`}</Text>
          </Pressable>
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
