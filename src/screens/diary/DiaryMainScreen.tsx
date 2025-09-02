import { View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DiaryStackParamList } from '@/types/navigation';
import Icon from '@common/Icon';
import EmotionCalendar from '@diary/EmotionCalendar';

const DiaryMainScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DiaryStackParamList>>();
  return (
    <ScrollView>
      <View className="gap-7 bg-gray-50 pb-6 pt-8">
        <View className="mx-7 items-center gap-5 rounded-[20px] bg-white px-6 py-5">
          <View className="gap-4">
            <View className="items-center">
              <Icon name="IcPaw" size={24} fill="#343434" />
              <Text className="body2 text-[#343434]">{`오늘의 질문`}</Text>
            </View>
            <Text className="subHeading3 text-center text-gray-900">{`진심으로 행복하다고 느꼈던\n하루에 대해 알려주세요.`}</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('DiaryWrite')}
            className="flex-row items-center gap-1 rounded-xl bg-primary px-9 py-2"
          >
            <Icon name="IcEdit" size={24} fill="white" />
            <Text className="body1 leading-[1.6] text-white">{`일기 쓰러가기`}</Text>
          </Pressable>
        </View>
        <View>
          <EmotionCalendar />
        </View>
      </View>
    </ScrollView>
  );
};

export default DiaryMainScreen;
