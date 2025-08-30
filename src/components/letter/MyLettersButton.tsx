import React from 'react';
import { View, Button } from 'react-native';
import { useLetterFilter } from './LetterContext';

const MyLettersButton: React.FC = () => {
  const { showMyLetters, setShowMyLetters } = useLetterFilter();
  return (
    <View style={{ flexDirection: 'row', margin: 16 }}>
      <Button
        title="모두의 편지"
        onPress={() => setShowMyLetters(false)}
        color={showMyLetters ? '#aaa' : '#2196F3'}
      />
      <View style={{ width: 12 }} />
      <Button
        title="내가 쓴 편지"
        onPress={() => setShowMyLetters(true)}
        color={showMyLetters ? '#2196F3' : '#aaa'}
      />
    </View>
  );
};

export default MyLettersButton;
