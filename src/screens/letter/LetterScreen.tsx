import { View } from 'react-native';
import LetterWriteButton from '@/components/letter/LetterWriteButton'; 
import { LetterProvider } from '@/components/letter/LetterContext';
import MyLettersButton from '@/components/letter/MyLettersButton';
import LetterFeed from '@/components/letter/LetterFeed';

const LetterScreen = () => {
  return (
    <LetterProvider>
      <View className="flex-1 bg-white">
        <MyLettersButton />
        <LetterFeed />
        <LetterWriteButton />
    </View>
    </LetterProvider>
  );
};

export default LetterScreen;
