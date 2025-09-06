import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  Switch,
  Pressable,
  ScrollView,
} from 'react-native';
import { Dimensions, PixelRatio } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from 'src/types/navigation';
// AsyncStorage removed: not used in this screen
import * as ImagePicker from 'expo-image-picker';
import { fetchLetterById, createLetter, updateLetter } from '@/services/letters';
import { formatKoreanDate } from '@/utils/formatDate';
import Icon from '@common/Icon';
import { useAuth } from '@/provider/AuthProvider';

// local user id will be fetched from local mock server (/users)
// do not hardcode — fetch at runtime so tests/dev can change db.json

const LetterWriteScreen = () => {
  const [letter, setLetter] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
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

  // 측정: 이미지 원본 크기(px) → dp 변환을 위한 상태 저장
  useEffect(() => {
    if (!imageUri) {
      setNaturalSize(null);
      return;
    }
    Image.getSize(
      imageUri,
      (w, h) => setNaturalSize({ w, h }),
      () => setNaturalSize(null)
    );
  }, [imageUri]);

  // user is provided by AuthProvider (may be null in dev/mock mode)

  const handleSave = useCallback(async () => {
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
  }, [imageUri, letter, isPublic, editingId, user, navigation, originalHasPhoto]);

  // 헤더 구성 (완료 버튼)
  useLayoutEffect(() => {
    navigation.setOptions({
      title: editingId ? '한 마디 편지 수정' : '한 마디 편지 쓰기',
      headerStyle: { backgroundColor: '#121826' },
      headerTintColor: '#FFFFFF',
      headerRight: () => (
        <Pressable
          onPress={handleSave}
          disabled={!letter.trim()}
          style={{
            backgroundColor: !letter.trim() ? '#E6D08F' : '#FFD86F',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontWeight: '600', color: '#121826', fontSize: 14 }}>완료</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleSave, letter, editingId]);

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
    <View style={{ flex: 1, backgroundColor: '#121826' }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 48, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center' }}>
          <Icon name="IcBigflower" size={56} color="#F2F2F2" />
          <Text style={{ marginTop: 16, color: '#AAAAAA', fontSize: 12 }}>{formatKoreanDate(new Date().toISOString())}</Text>
          <Text
            style={{
              marginTop: 24,
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600',
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            사랑하는 반려동물과의 소중한 추억을 함께 나눠요
          </Text>
        </View>

        {/* 입력 카드 */}
        <View
          style={{
            marginTop: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            padding: 20,
            backgroundColor: '#121826',
          }}
        >
          <TextInput
            style={{
              minHeight: 140,
              color: '#F2F2F2',
              fontSize: 14,
              lineHeight: 20,
            }}
            multiline
            placeholder="텍스트를 입력해주세요."
            placeholderTextColor="#6B6B6B"
            value={letter}
            maxLength={100}
            onChangeText={setLetter}
            textAlignVertical="top"
          />
          <Text style={{ position: 'absolute', right: 20, bottom: 20, fontSize: 12, color: '#AAAAAA' }}>{`${letter.length} / 최대 100자`}</Text>
        </View>

        {/* 사진 첨부 버튼 & 프리뷰 */}
        <View style={{ marginTop: 20, alignItems: 'flex-end' }}>
          <Pressable
            onPress={pickImage}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#FFD86F',
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: '#121826',
              gap: 6,
            }}
          >
            <Icon name="IcPic" size={18} color="#FFD86F" />
            <Text style={{ color: '#FFD86F', fontWeight: '600' }}>사진 첨부</Text>
          </Pressable>
        </View>
        {imageUri && (
          <View style={{ marginTop: 16, alignSelf: 'center', position: 'relative' }}>
            {(() => {
              const windowWidth = Dimensions.get('window').width;
              const horizontalPadding = 56; // screen padding + alignment
              const maxWidth = Math.max(0, windowWidth - horizontalPadding);
              const ratio = PixelRatio.get();
              const wDp = naturalSize ? naturalSize.w / ratio : maxWidth;
              const renderWidth = Math.min(wDp, maxWidth);
              const renderHeight = naturalSize && naturalSize.w > 0 ? (naturalSize.h / naturalSize.w) * renderWidth : 200;
              return (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: renderWidth, height: renderHeight, borderRadius: 12 }}
                  resizeMode="cover"
                />
              );
            })()}
            <TouchableOpacity
              onPress={() => setImageUri(null)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ position: 'absolute', top: 6, right: 6 }}
            >
              <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>×</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* 안내 문구 */}
        <Text
          style={{
            marginTop: 40,
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          글을 함께 보며 헌화를 주고받아보세요
        </Text>

        {/* 공개 토글 카드 */}
        <View
          style={{
            marginTop: 28,
            backgroundColor: '#1F2A3C',
            borderRadius: 24,
            paddingHorizontal: 24,
            paddingVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexShrink: 1 }}>
            <Text style={{ color: '#F2F2F2', fontSize: 13, fontWeight: '600' }}>이 글 전체공개 하면</Text>
            <Text style={{ color: '#F2F2F2', fontSize: 13, marginTop: 4 }}>헌화를 받을 수 있어요.</Text>
          </View>
          <Switch value={isPublic} onValueChange={setIsPublic} />
        </View>
      </ScrollView>
    </View>
  );
};

export default LetterWriteScreen;
