import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from 'src/types/navigation';

const LetterWriteScreen = () => {
  const [letter, setLetter] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSave = () => {
    Alert.alert('저장 완료', '편지가 저장되었습니다.');
    setLetter('');
    navigation.navigate('Tabs', { screen: 'Letter' }); 
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder="편지를 작성하세요..."
        value={letter}
        onChangeText={setLetter}
      />
      <Button title="저장" onPress={handleSave} disabled={!letter.trim()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, textAlignVertical: 'top' },
});

export default LetterWriteScreen;