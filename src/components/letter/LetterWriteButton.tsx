import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { LetterStackParamList } from 'src/types/navigation';

const LetterWriteButton = () => {
  const navigation = useNavigation<StackNavigationProp<LetterStackParamList>>();

  const handlePress = () => {
    navigation.navigate('LetterWriteScreen');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>편지 작성하기</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { padding: 12, backgroundColor: '#4F8EF7', borderRadius: 8 },
  text: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});

export default LetterWriteButton;
