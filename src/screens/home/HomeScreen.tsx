import { SafeAreaView, View, Text, Pressable, StatusBar, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { TabsParamList } from '@/types/navigation';
import Icon from '@common/Icon';
import { useDailyTopic } from "@/hooks/queries/useDailyTopic";
import { useLayoutEffect } from 'react';
import { setHeaderExtras } from '@/types/Header';
import Loader from '@common/Loader';
import { keepAllKorean } from '@/utils/keepAll';
import { useAuth } from '@/provider/AuthProvider';

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabsParamList>>();
  const { user } = useAuth();
  const nickname = user?.nickname ?? '사용자';

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
      {/* 오늘의 질문 카드 */}
      <View className="pt-8 px-6">
        <View className="rounded-2xl bg-[#1F2A3C] px-7 py-6 items-center gap-6">
          {topicIsLoading && <Loader />}
          <View className="items-center gap-3">
            <Icon name="IcPaw" size={24} fill="#FFFFFF" />
            <Text className="body2 text-white">오늘의 질문</Text>
            {topicIsLoading ? null : isError ? (
              <Pressable onPress={() => refetch()} className="rounded-xl bg-[#2A3649] px-5 py-2">
                <Text className="subHeading3 text-error">다시 시도</Text>
              </Pressable>
            ) : (
              <Text className="subHeading3 text-center text-white leading-5">{keepAllKorean(topicText)}</Text>
            )}
          </View>
          <Pressable
            onPress={() =>
              navigation.navigate('Diary', {
                screen: 'DiaryWrite',
                params: { topic: topicText },
              })
            }
            className="flex-row items-center gap-2 rounded-xl bg-[#FFD86F] px-10 py-3"
          >
            <Icon name="IcEdit" size={20} fill="#1F2A3C" />
            <Text className="body1 text-[#1F2A3C]">일기 쓰러가기</Text>
          </Pressable>
        </View>
      </View>

      {/* 닉네임 & 강아지 이미지 */}
      <View className="flex-1 items-center mt-8 px-6">
        <Text className="text-[24px] font-extrabold mb-2" numberOfLines={1}>
          <Text className="text-[#FFD86F]">{nickname}</Text>
          <Text className="text-white"> 님,</Text>
        </Text>
        <Text className="text-white text-[16px] font-medium">오늘도 편안한 하루 보내세요.</Text>
        <Image
          source={require('../../../assets/images/main-dog.png')}
        />
      </View>
    </SafeAreaView>
  );
}