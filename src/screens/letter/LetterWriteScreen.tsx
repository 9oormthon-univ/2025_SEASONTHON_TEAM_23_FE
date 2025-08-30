import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from 'src/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LetterWriteScreen = () => {
  const [letter, setLetter] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSave = async () => {
    try {
      // 편지 내용을 로컬에 저장하도록
      await AsyncStorage.setItem('letter', letter);
      Alert.alert('저장 완료', '편지가 저장되었습니다.');
      setLetter('');
      navigation.navigate('Tabs', { screen: 'Letter' }); 
    } catch (error) {
      Alert.alert('저장 실패', '다시 시도해 주세요.');
    }
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