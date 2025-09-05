import { View } from 'react-native';
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
      <View className="flex-1 bg-bg">
        <LetterFeed />
        <WriteButton label="편지 쓰기" onPress={() => navigation.navigate('LetterWriteScreen')} />
      </View>
    </LetterProvider>
  );
};

export default LetterScreen;
