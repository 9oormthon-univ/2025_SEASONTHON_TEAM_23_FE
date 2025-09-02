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
  const [originalHasPhoto, setOriginalHasPhoto] = useState<boolean | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(true);
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
  setIsPublic(res.data?.isPublic ?? true);
    const photo = res.data?.photoUrl ?? null;
    setImageUri(photo);
        // remember whether the original letter had a photo
        setOriginalHasPhoto(!!photo);
      } catch (e) {
        // ignore load error
      }
    })();
  }, [editingId]);

  const handleSave = async () => {
    try {
      // normalize imageUri: '' 를 null로 처리
      const normalizedImageUri = imageUri && imageUri !== '' ? imageUri : null;

      // build payload for json-server (POST용)
  const payload: any = {
    userId: LOCAL_USER_ID,
    content: letter,
  isPublic: isPublic,
    createdAt: new Date().toISOString(),
    tributeCount: 0,
  };
      // 신규 생성시에만 photo_url을 포함 (값이 있을 때)
      if (normalizedImageUri !== null) {
        payload.photo_url = normalizedImageUri;
      }

      if (editingId) {
        // PATCH existing
        // construct update object:
        const normalizedImage = normalizedImageUri;
        const updateData: any = { content: letter };
  // always include updated isPublic
  updateData.isPublic = isPublic;
        if (normalizedImage !== null) {
          // 사용자가 새 이미지를 추가한 경우
          updateData.photoUrl = normalizedImage;
        } else {
          // 사용자가 이미지를 제거했을 때(original had photo), null로 설정
          if (originalHasPhoto) updateData.photoUrl = null;
          // originalHasPhoto가 false면 photoUrl 필드 자체를 생략해서 기존 값 유지
        }
  await axios.patch(`http://10.0.2.2:3001/letters/${editingId}`, updateData);
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
      {/* top-right toggle */}
      <View className="flex-row justify-end mb-3">
        <TouchableOpacity
          onPress={() => setIsPublic(true)}
          className={`px-4 py-2 rounded-l-lg ${isPublic ? 'bg-blue-500' : 'bg-gray-200'}`}
        >
          <Text className={`${isPublic ? 'text-white' : 'text-gray-700'}`}>전체공개</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsPublic(false)}
          className={`px-4 py-2 rounded-r-lg ${!isPublic ? 'bg-blue-500' : 'bg-gray-200'}`}
        >
          <Text className={`${!isPublic ? 'text-white' : 'text-gray-700'}`}>나만보기</Text>
        </TouchableOpacity>
      </View>
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