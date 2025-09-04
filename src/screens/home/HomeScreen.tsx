import { SafeAreaView, View, Text, Pressable, StatusBar } from "react-native";
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { TabsParamList } from '@/types/navigation';
import Icon from '@common/Icon';
import { useDailyTopic } from "@/hooks/queries/useDailyTopic";
import { useLayoutEffect } from 'react';
import { setHeaderExtras } from '@/types/Header';
import Loader from '@common/Loader';
import { keepAllKorean } from '@/utils/keepAll';

type Props = {
  nickname: string;
  question: string;
  onPressWrite: () => void;
  onPressBell?: () => void;
};

export default function HomeScreen({
  nickname
}: Props) {
  const navigation = useNavigation<BottomTabNavigationProp<TabsParamList>>();

  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      title: '오늘의 일기',
      hasBack: true,
      hasButton: true,
      icon: 'IcNotification',
    });
  }, [navigation]);
  
  const { data, isLoading: topicIsLoading, isError, refetch } = useDailyTopic();
  const topicText = isError
    ? '오늘의 주제를 불러오지 못했어요.'
    : (data?.topic ?? '오늘의 주제가 없습니다.');

  return (
    <SafeAreaView className="flex-1 bg-[#121826]">
      <StatusBar barStyle="light-content" />
      <View className="mt-6 px-10">
        <Text className="text-[#FFFFFF] text-[28px] font-extrabold mb-1" numberOfLines={1}>
          {nickname} 님,
        </Text>
        <Text className="text-[#FFFFFF] text-[16px] font-medium">오늘도 편안한 하루 보내세요.</Text>
      </View>

      <View className="gap-7 pb-6 pt-8 bg-transparent">
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
            onPress={() =>
              navigation.navigate('Diary', {
                screen: 'DiaryWrite',
                params: { topic: topicText },
              })
            }
            className="flex-row items-center gap-1 rounded-xl bg-[#1F2A3C] px-9 py-2"
          >
            <Icon name="IcEdit" size={24} fill="white" />
            <Text className="body1 leading-[1.6] text-white">{`일기 쓰러가기`}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}