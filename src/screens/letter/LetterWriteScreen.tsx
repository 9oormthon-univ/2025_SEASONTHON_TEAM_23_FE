import { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from 'src/types/navigation';
// AsyncStorage removed: not used in this screen
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

// local fallback user id (from db.json)
const LOCAL_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

const LetterWriteScreen = () => {
  const [letter, setLetter] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const editingId = route?.params?.id ?? null;

  useEffect(() => {
    // if editing, load existing letter into state
    if (!editingId) return;
    (async () => {
      try {
        const res = await axios.get(`http://10.0.2.2:3001/letters/${editingId}`);
        setLetter(res.data?.content ?? '');
        setImageUri(res.data?.photo_url ?? null);
      } catch (e) {
        // ignore load error
      }
    })();
  }, [editingId]);

  const handleSave = async () => {
    try {
      // build payload for json-server
      const payload: any = {
        user_id: LOCAL_USER_ID,
        content: letter,
        photo_url: imageUri,
        is_public: true,
        created_at: new Date().toISOString(),
        tribute_count: 0,
      };

      if (editingId) {
        // PATCH existing
        await axios.patch(`http://10.0.2.2:3001/letters/${editingId}`, {
          content: letter,
          photo_url: imageUri,
        });
      } else {
        // POST new
        await axios.post('http://10.0.2.2:3001/letters', payload);
      }

      Alert.alert('저장 완료', '편지가 서버에 저장되었습니다.', [
        { text: '확인', onPress: () => navigation.navigate('Tabs', { screen: 'Letter' } as any) },
      ]);
      setLetter('');
      setImageUri(null);
    } catch (error) {
      Alert.alert('저장 실패', '서버에 저장하는 중 오류가 발생했습니다.');
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