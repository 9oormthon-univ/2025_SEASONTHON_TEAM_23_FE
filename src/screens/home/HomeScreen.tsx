import { SafeAreaView, View, Text, Image } from 'react-native';
import { useAuth } from '@/provider/AuthProvider';
import { useDailyLogMoodAnalyze } from '@/hooks/queries/useDailyLogMoodAnalyze';
import Icon from '@common/Icon';
import { ACTIVE_UI } from '@/constants/diary/emoji';

export default function HomeScreen() {
  const { user } = useAuth();
  const nickname = user?.nickname ?? '사용자';

  const { data: moodAnalyze } = useDailyLogMoodAnalyze();

  return (
    <SafeAreaView className="flex-1 bg-bg pt-5">
      <View className="gap-16 px-7">
        {/* 지난 달 통계 박스 (스타일: '오늘의 질문' 박스와 통일) */}
        {moodAnalyze && (
          <View className="items-center gap-4 overflow-hidden rounded-[20px] bg-bg-light px-6 py-5">
            <Icon name="IcSmiley" width={24} height={24} color={ACTIVE_UI.best.icon} />
            <Text className="subHeading3 text-center !leading-7 text-white">
              {`지난 달에 작성한 ${moodAnalyze.dailyCount}개의 일기 중,\n좋았던 날은 ${moodAnalyze.bestMoodCount}일이에요.`}
            </Text>
          </View>
        )}
        {/* 닉네임 & 강아지 이미지 */}
        <View className="items-center px-14">
          <Text className="heading3 !leading-10" numberOfLines={1}>
            <Text className="text-yellow-200">{nickname}</Text>
            <Text className="text-white">{` 님,`}</Text>
          </Text>
          <Text className="subHeading1B !leading-8 text-white">{`오늘도 편안한 하루 보내세요.`}</Text>
          <Image source={require('@images/main-dog.png')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
