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
// (이전 로직 잔여) import { Dimensions, PixelRatio } from 'react-native'; // 전체폭 이미지 렌더링 제거로 미사용
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { LetterStackParamList } from 'src/types/navigation';
// AsyncStorage removed: not used in this screen
import * as ImagePicker from 'expo-image-picker';
import { fetchLetterById, createLetter, updateLetter } from '@/services/letters';
import { formatKoreanDate } from '@/utils/formatDate';
import Icon from '@common/Icon';
import { useAuth } from '@/provider/AuthProvider';
import { setHeaderExtras } from '@/types/Header';

// local user id will be fetched from local mock server (/users)
// do not hardcode — fetch at runtime so tests/dev can change db.json

const LetterWriteScreen = () => {
  const [letter, setLetter] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  // (이전) 원본 비율 기반 전체폭 프리뷰용 naturalSize 상태는 작은 썸네일 방식으로 변경되며 더 이상 필요하지 않아 제거.
  // const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null); // 현재 미사용
  const [originalHasPhoto, setOriginalHasPhoto] = useState<boolean | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<LetterStackParamList>>();
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
  // 작은 썸네일만 사용할 때는 실제 렌더링에 필요 없지만, 나중 재확대 기능 대비 크기 정보는 유지 가능.
  // useEffect(() => {
  //   if (!imageUri) {
  //     setNaturalSize(null);
  //     return;
  //   }
  //   Image.getSize(imageUri, (w, h) => setNaturalSize({ w, h }), () => setNaturalSize(null));
  // }, [imageUri]);

  // user is provided by AuthProvider (may be null in dev/mock mode)

  const [isSaving, setIsSaving] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const handleSave = useCallback(async () => {
    if (isSaving || hasSubmitted) return; // 중복 제출 방지
    try {
      setIsSaving(true);
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
        { text: '확인', onPress: () => navigation.navigate('LetterScreen') },
      ]);
      setLetter('');
      setImageUri(null);
    setHasSubmitted(true); // 첫 성공 후 영구 비활성
    } catch (error) {
      Alert.alert('저장 실패', '서버에 저장하는 중 오류가 발생했습니다.');
    } finally {
    setIsSaving(false);
    }
  }, [imageUri, letter, isPublic, editingId, user, navigation, originalHasPhoto, isSaving, hasSubmitted]);

  // 헤더 구성 (완료 버튼)
  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      title: editingId ? '한 마디 편지 수정' : '한 마디 편지 쓰기',
  disabled: !letter.trim() || isSaving || hasSubmitted,
      hasBack: true,
      hasButton: true,
      onPress: handleSave,
    });
  }, [navigation, handleSave, letter, isSaving, hasSubmitted, editingId]);

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
          <Icon name="IcStarSky" size={56} color="#F2F2F2" />
          <Text style={{ marginTop: 16, color: '#AAAAAA', fontSize: 12 }}>
            {formatKoreanDate(new Date().toISOString())}
          </Text>
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
          <Text
            style={{ position: 'absolute', right: 20, bottom: 20, fontSize: 12, color: '#AAAAAA' }}
          >{`${letter.length} / 최대 100자`}</Text>
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
          <View
            style={{
              marginTop: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              alignSelf: 'flex-start',
            }}
          >
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: imageUri }}
                style={{ width: 84, height: 84, borderRadius: 12, backgroundColor: '#1F2A3C' }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setImageUri(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{ position: 'absolute', top: -6, right: -6 }}
              >
                <View
                  style={{
                    height: 22,
                    width: 22,
                    borderRadius: 11,
                    backgroundColor: 'rgba(0,0,0,0.65)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.6)',
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>×</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Pressable
              onPress={pickImage}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#394356',
                backgroundColor: '#1F2A3C',
              }}
            >
              <Text style={{ color: '#F2F2F2', fontSize: 12 }}>다른 사진 선택</Text>
            </Pressable>
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
            <Text style={{ color: '#F2F2F2', fontSize: 13, fontWeight: '600' }}>
              이 글 전체공개 하면
            </Text>
            <Text style={{ color: '#F2F2F2', fontSize: 13, marginTop: 4 }}>
              헌화를 받을 수 있어요.
            </Text>
          </View>
          <Switch value={isPublic} onValueChange={setIsPublic} />
        </View>
      </ScrollView>
    </View>
  );
};

export default LetterWriteScreen;
