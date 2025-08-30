import { useState } from 'react';
import { View, TextInput, Button, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from 'src/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const LetterWriteScreen = () => {
  const [letter, setLetter] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSave = async () => {
    try {
      const letterData = {
        content: letter,
        imageUri: imageUri,
      };
      await AsyncStorage.setItem('letter', JSON.stringify(letterData));
      Alert.alert(
        '저장 완료',
        '편지가 저장되었습니다.',
        [
          {
            text: '확인',
            onPress: () => navigation.navigate('Tabs', { screen: 'Letter' }),
          },
        ]
      );
      setLetter('');
      setImageUri(null);
    } catch (error) {
      Alert.alert('저장 실패', '다시 시도해 주세요.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <TextInput
        className="flex-1 border border-gray-300 rounded-lg p-3 mb-4 text-base"
        multiline
        placeholder="편지를 작성하세요..."
        value={letter}
        onChangeText={setLetter}
        textAlignVertical="top"
      />
      <Button title="사진 첨부" onPress={pickImage} />
      {imageUri && (
        <View className="relative self-center mb-4">
          <Image source={{ uri: imageUri }} className="w-48 h-48 rounded-lg" />
          <TouchableOpacity
            className="absolute top-2 right-2"
            onPress={() => setImageUri(null)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View className="w-6 h-6 rounded-full bg-white justify-center items-center shadow">
              <Text className="text-lg font-bold text-gray-700">×</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      <Button title="저장" onPress={handleSave} disabled={!letter.trim()} />
    </View>
  );
};

export default LetterWriteScreen;