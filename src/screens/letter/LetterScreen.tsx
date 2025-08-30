import { View, Text } from 'react-native';
import LetterWriteButton from '@/components/letter/LetterWriteButton'; 

const LetterScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold">한마디 편지</Text>
      <LetterWriteButton />
    </View>
  );
};

export default LetterScreen;
