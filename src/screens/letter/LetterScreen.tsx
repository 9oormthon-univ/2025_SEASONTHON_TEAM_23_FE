import { View } from 'react-native';
import LetterWriteButton from '@/components/letter/LetterWriteButton'; 
import { LetterProvider } from '@/components/letter/LetterContext';
import LetterFeed from '@/components/letter/LetterFeed';

const LetterScreen = () => {
  return (
    <LetterProvider>
      <View className="flex-1 bg-white">
        <LetterFeed />
        <LetterWriteButton />
    </View>
    </LetterProvider>
  );
};

export default LetterScreen;
