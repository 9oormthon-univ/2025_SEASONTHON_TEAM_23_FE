import { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Image, TouchableOpacity, Text, Switch } from 'react-native';
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

      // build payload for json-server (POST용)
      const userId = (user as any)?.id ?? (user as any)?.userId;
      const payload: any = {
        // user id 필드명 환경에 따라 다를 수 있으므로 runtime에서 추출
        userId,
        content: letter,
        isPublic: isPublic,
        createdAt: new Date().toISOString(),
        tributeCount: 0,
      };
      // 신규 생성시에만 photoUrl을 포함 (값이 있을 때)
      if (normalizedImageUri !== null) {
        // 선택: 서비스에서 파일 업로드 엔드포인트가 있고 uploadLetterImage를 사용한다면
        // const uploaded = await uploadLetterImage({ uri: normalizedImageUri });
        // payload.photoUrl = uploaded?.url ?? normalizedImageUri;
        payload.photoUrl = normalizedImageUri;
      }

  // ensure we have a userId (either id or userId from server/mock)
  if (!userId) {
        Alert.alert('사용자 정보를 불러오지 못했습니다. 편지를 저장할 수 없습니다.');
        return;
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
        await updateLetter(editingId, updateData);
      } else {
        // POST new
        await createLetter(payload);
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
      <View className="mb-4 relative">
        <TextInput
          className="w-full border border-gray-300 rounded-lg p-3 text-base min-h-[120px] pb-7"
          multiline
          placeholder="편지를 작성하세요..."
          value={letter}
          maxLength={100}
          onChangeText={setLetter}
          textAlignVertical="top"
        />
        <Text className="absolute right-4 bottom-4 text-xs text-gray-400">{`${letter.length}/최대 100자`}</Text>
      </View>
      <View className="mb-3 flex-row items-center justify-end">
        <Text className="mr-3 text-sm text-gray-700">전체공개하면 헌화를 받을 수 있어요.</Text>
        <Switch value={isPublic} onValueChange={setIsPublic} />
      </View>
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