import { SafeAreaView, View, Text, Image } from 'react-native';
import { useAuth } from '@/provider/AuthProvider';
import MonthlyStatsBox from '@/components/home/MonthlyStatsBox';

export default function HomeScreen() {
  const { user } = useAuth();
  const nickname = user?.nickname ?? '사용자';

  return (
    <SafeAreaView className="flex-1 bg-bg pt-5">
      <View className="gap-16 px-7">
        {/* 지난 달 통계 박스 */}
        <MonthlyStatsBox />
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
