import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from 'src/types/navigation';
// AsyncStorage removed: not used in this screen
import * as ImagePicker from 'expo-image-picker';
import { fetchLetterById, createLetter, updateLetter } from '@/services/letters';
import { useAuth } from '@/provider/AuthProvider';

// local user id will be fetched from local mock server (/users)
// do not hardcode — fetch at runtime so tests/dev can change db.json

const LetterWriteScreen = () => {
  const [letter, setLetter] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalHasPhoto, setOriginalHasPhoto] = useState<boolean | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const editingId = route?.params?.id ?? null;

  useEffect(() => {
    // if editing, load existing letter into state via services
    if (!editingId) return;
    (async () => {
      try {
        const res = await fetchLetterById(editingId);
        const data = (res as any)?.data ?? res;
        setLetter(data?.content ?? '');
        setIsPublic(data?.isPublic ?? true);
        const photo = data?.photoUrl ?? null;
        setImageUri(photo);
        // remember whether the original letter had a photo
        setOriginalHasPhoto(!!photo);
      } catch (e) {
        // ignore load error
      }
    })();
  }, [editingId]);

  // user is provided by AuthProvider (may be null in dev/mock mode)

  const handleSave = async () => {
    try {
      // normalize imageUri: '' 를 null로 처리
      const normalizedImageUri = imageUri && imageUri !== '' ? imageUri : null;

      // 생성 시(form-data 요구)에는 사용자 id를 본문에 포함하지 않음
      const userId = (user as any)?.id ?? (user as any)?.userId;
      // ensure we have a userId (either id or userId from server/mock)
      if (!userId) {
        Alert.alert('사용자 정보를 불러오지 못했습니다. 편지를 저장할 수 없습니다.');
        return;
      }

      if (editingId) {
        // PUT existing — multipart/form-data
        const willRemoveImage = originalHasPhoto && normalizedImageUri === null;
        await updateLetter(editingId, {
          content: letter,
          isPublic,
          image: normalizedImageUri
            ? { uri: normalizedImageUri, name: 'photo.jpg', type: 'image/jpeg' }
            : undefined,
          removeImage: !!willRemoveImage,
        });
      } else {
        // POST new — multipart/form-data
        await createLetter({
          content: letter,
          isPublic,
          image: normalizedImageUri
            ? { uri: normalizedImageUri, name: 'photo.jpg', type: 'image/jpeg' }
            : undefined,
        });
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
      <View className="relative mb-4">
        <TextInput
          className="min-h-[120px] w-full rounded-lg border border-gray-300 p-3 pb-7 text-base"
          multiline
          placeholder="편지를 작성하세요..."
          value={letter}
          maxLength={100}
          onChangeText={setLetter}
          textAlignVertical="top"
        />
        <Text className="absolute bottom-4 right-4 text-xs text-gray-400">{`${letter.length}/최대 100자`}</Text>
      </View>
      <View className="mb-3 flex-row items-center justify-end">
        <Text className="mr-3 text-sm text-gray-700">전체공개하면 헌화를 받을 수 있어요.</Text>
        <Switch value={isPublic} onValueChange={setIsPublic} />
      </View>
      <Button title="사진 첨부" onPress={pickImage} />
      {imageUri && (
        <View className="relative mb-4 self-center">
          <Image source={{ uri: imageUri }} className="h-48 w-48 rounded-lg" />
          <TouchableOpacity
            className="absolute right-2 top-2"
            onPress={() => setImageUri(null)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View className="h-6 w-6 items-center justify-center rounded-full bg-white shadow">
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
