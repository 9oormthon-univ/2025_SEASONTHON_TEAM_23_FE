import { View, Text } from 'react-native';
import WriteButton from '@/components/common/WriteButton';
import { LetterProvider } from '@/components/letter/LetterContext';
import LetterFeed from '@/components/letter/LetterFeed';
import type { LetterStackParamList } from '@/types/navigation';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const LetterScreen = () => {
  const navigation = useNavigation<StackNavigationProp<LetterStackParamList>>();

  return (
    <LetterProvider>
      <View className="flex-1 gap-7 bg-bg px-7 pt-8">
        <View className="items-center gap-5 rounded-[20px] bg-bg-light px-6 py-5">
          <Text className="subHeading3 text-center text-body-100">{`사랑하는 반려동물과의 소중한\n추억을 함께 나누세요.`}</Text>
          <WriteButton label="편지 쓰기" onPress={() => navigation.navigate('LetterWriteScreen')} />
        </View>
        <LetterFeed />
      </View>
    </LetterProvider>
  );
};

export default LetterScreen;
