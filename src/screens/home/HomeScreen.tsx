import { SafeAreaView, View, Text, Image } from 'react-native';
import { useAuth } from '@/provider/AuthProvider';
import { useDailyLogMoodAnalyze } from '@/hooks/queries/useDailyLogMoodAnalyze';
import Icon from '@common/Icon';

export default function HomeScreen() {
  const { user } = useAuth();
  const nickname = user?.nickname ?? '사용자';

  const { data: moodAnalyze } = useDailyLogMoodAnalyze();

  return (
    <SafeAreaView className="flex-1 bg-[#121826]">
      {/* 지난 달 통계 박스 (스타일: '오늘의 질문' 박스와 통일) */}
      {moodAnalyze && (
        <View
          className="relative mb-8 mt-10 items-center self-center overflow-hidden rounded-[20px] bg-bg-light px-6 py-5"
          style={{ width: '88%' }}
        >
          <Icon name="IcSmiley" width={25} height={25} bottom={5} color="#6BBD39" />
          <Text className="subHeading3 text-center text-white">
            {`지난 달에 작성한 ${moodAnalyze.dailyCount}개의 일기 중,\n좋았던 날은 ${moodAnalyze.bestMoodCount}일이에요.`}
          </Text>
        </View>
      )}
      {/* 닉네임 & 강아지 이미지 */}
      <View className="mt-20 flex-1 items-center px-6">
        <Text className="mb-2 text-[24px] font-extrabold" numberOfLines={1}>
          <Text className="text-[#FFD86F]">{nickname}</Text>
          <Text className="text-white"> 님,</Text>
        </Text>
        <Text className="text-[16px] font-medium text-white">오늘도 편안한 하루 보내세요.</Text>
        <Image source={require('../../../assets/images/main-dog.png')} />
      </View>
    </SafeAreaView>
  );
}
