import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, TextInput, Alert, Image, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { LetterStackParamList } from 'src/types/navigation';
import * as ImagePicker from 'expo-image-picker';
import { fetchLetterById, createLetter, updateLetter } from '@/services/letters';
import { formatKoreanDate } from '@/utils/formatDate';
import Icon from '@common/Icon';
import { useAuth } from '@/provider/AuthProvider';
import { setHeaderExtras } from '@/types/Header';
import CustomSwitch from '@common/CustomSwitch';

const LetterWriteScreen = () => {
  const [focused, setFocused] = useState(false);
  const [letter, setLetter] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalHasPhoto, setOriginalHasPhoto] = useState<boolean | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<LetterStackParamList>>();
  const route = useRoute<any>();
  const editingId = route?.params?.id ?? null;

  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const res = await fetchLetterById(editingId);
        const data = (res as any)?.data ?? res;
        setLetter(data?.content ?? '');
        setIsPublic(data?.isPublic ?? true);
        const photo = data?.photoUrl ?? null;
        setImageUri(photo);
        setOriginalHasPhoto(!!photo);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [editingId]);

  const [isSaving, setIsSaving] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const handleSave = useCallback(async () => {
    if (isSaving || hasSubmitted) return;
    try {
      setIsSaving(true);
      const normalizedImageUri = imageUri && imageUri !== '' ? imageUri : null;

      const userId = (user as any)?.id ?? (user as any)?.userId;
      if (!userId) {
        Alert.alert('사용자 정보를 불러오지 못했습니다. 편지를 저장할 수 없습니다.');
        console.error('유저 아이디 없음');
        return;
      }

      if (editingId) {
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
      console.log('편지 저장 완료');
      setLetter('');
      setImageUri(null);
      setHasSubmitted(true); // 첫 성공 후 영구 비활성
    } catch (error) {
      Alert.alert('저장 실패', '서버에 저장하는 중 오류가 발생했습니다.');
      console.error('편지 저장 실패:', error);
    } finally {
      setIsSaving(false);
    }
  }, [
    imageUri,
    letter,
    isPublic,
    editingId,
    user,
    navigation,
    originalHasPhoto,
    isSaving,
    hasSubmitted,
  ]);

  // 헤더 구성 (완료 버튼)
  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      title: '기억의 별자리',
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
      allowsMultipleSelection: false,
      selectionLimit: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView className="flex=-1 bg-bg" keyboardShouldPersistTaps="handled">
      <View className="gap-5 px-7 pb-14 pt-10">
        <View className="gap-4">
          <View className="items-center gap-6">
            <View className="items-center gap-2">
              {Platform.OS === 'ios' ? (
                <Image
                  source={require('@images/star-sky.png')}
                  style={{ width: 56 * (124 / 88), height: 56 }}
                  resizeMode="contain"
                />
              ) : (
                <Icon name="IcStarSky" width={123} height={88} />
              )}
              <Text className="body2 text-gray-600">
                {formatKoreanDate(new Date().toISOString())}
              </Text>
            </View>
            <Text className="subHeading3 text-white">
              {`사랑하는 반려동물과의 소중한 추억을 함께 나눠요`}
            </Text>
          </View>

          <View className="gap-2">
            {/* 입력 카드 */}
            <View
              className={`${focused ? 'border-gray-200' : 'border-gray-600'} rounded-[20px] border p-5`}
            >
              <TextInput
                className="body1 min-h-[160px] !leading-5 text-white"
                multiline
                placeholder="텍스트를 입력해주세요."
                placeholderTextColor="#9D9D9D"
                value={letter}
                maxLength={100}
                onChangeText={setLetter}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                textAlignVertical="top"
              />
              <View className="absolute bottom-5 left-5">
                {imageUri && (
                  <View className="relative bottom-3 w-[80px]">
                    <Image
                      source={{ uri: imageUri }}
                      className="h-[80px] w-[80px] rounded-xl border border-yellow-200 bg-[#464646]"
                      resizeMode="cover"
                    />
                    <Pressable
                      onPress={() => setImageUri(null)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      className="absolute right-1 top-1"
                    >
                      <Icon name="IcClose" size={20} />
                    </Pressable>
                  </View>
                )}
              </View>
              <Text className="captionSB absolute bottom-5 right-5 text-gray-500">{`${letter.length} / 최대 100자`}</Text>
            </View>

            {/* 사진 첨부 버튼 */}
            <View className="items-end">
              <Pressable
                disabled={!!imageUri}
                onPress={pickImage}
                className={`flex-row items-center gap-1 rounded-xl border px-4 py-2 ${imageUri ? 'border-gray-600 bg-gray-800' : 'border-yellow-200'}`}
              >
                <Icon name="IcPic" size={20} color={imageUri ? '#808080' : '#FFD86F'} />
                <Text
                  className={`body1 !leading-6  ${imageUri ? 'text-gray-600' : 'text-yellow-200'}`}
                >
                  {`사진 첨부`}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* 안내 문구 */}
        <View className="items-center gap-4">
          <Text className="subHeading3 text-white">{`글을 함께 보며 위로의 별을 주고받아보세요`}</Text>

          {/* 공개 토글 카드 */}
          <View className="w-full flex-row items-center justify-between rounded-[20px] bg-bg-light px-8 py-5">
            <View>
              <Text className="captionSB text-white">{`이 글을 전체공개 하면`}</Text>
              <Text className="body1 !leading-6 text-white">{`위로의 별을 받을 수 있어요.`}</Text>
            </View>
            <CustomSwitch value={isPublic} onValueChange={setIsPublic} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LetterWriteScreen;
