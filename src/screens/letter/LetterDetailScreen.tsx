import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, Alert, Image, Dimensions, PixelRatio } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { useTribute } from '@/provider/TributeProvider';
import { useAuth } from '@/provider/AuthProvider';
import { formatKoreanDate } from '@/utils/formatDate';
import { fetchLetterById, deleteLetter, fetchTributes as fetchLetterTributes } from '@/services/letters';

type Props = NativeStackScreenProps<RootStackParamList, 'LetterDetail'>;

const normalizeLetter = (raw: any) => {
	// 다양한 API 응답 형태를 하나의 표준형으로 변환
	if (!raw) return null;
	const id = raw.id ?? raw.letterId ?? raw._id ?? raw.letter_id ?? null;
	const content = raw.content ?? raw.body ?? raw.text ?? '';
	const createdAt = raw.createdAt ?? raw.created_at ?? raw.date ?? null;
	const photoUrl = raw.photoUrl ?? raw.photo_url ?? raw.imageUrl ?? raw.image_url ?? null;
	const tributeCount = Number(raw.tributeCount ?? raw.tribute_count ?? raw.tributes ?? 0) || 0;

	// author 정보: 객체 또는 id 필드 후보들을 합쳐서 간단히 표현
	const authorObj = raw.author ?? raw.user ?? null;
	const authorId = raw.authorId ?? raw.author_id ?? raw.userId ?? raw.user_id ?? authorObj?.id ?? authorObj?.userId ?? null;
	const author = authorObj
		? {
				id: authorObj.id ?? authorObj.userId ?? authorObj.user_id ?? null,
				nickname: authorObj.nickname ?? authorObj.name ?? authorObj.displayName ?? null,
		  }
		: authorId
		? { id: authorId, nickname: null }
		: null;

	return {
		// 화면 전체에서 사용하기 쉬운 형태
		id,
		content,
		createdAt,
		photoUrl,
		tributeCount,
		author,
		_raw: raw,
		// 보존: 원본의 가능성 있는 식별자들
		authorId,
	};
};

const LetterDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const id = route?.params?.id;
  const [letter, setLetter] = useState<any | null>(null);
  const [author, setAuthor] = useState<any | null>(null);
  const { toggleTribute, fetchTributes: refreshTributes } = useTribute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTributing, setIsTributing] = useState(false);
  const [hasMyTribute, setHasMyTribute] = useState(false);
  const { user } = useAuth();

  // 원본 이미지 사이즈로 표시를 위한 상태 (모든 렌더에서 동일한 훅 순서 보장 위해 상단에 둠)
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const uri = (letter && letter.photoUrl) ? String(letter.photoUrl) : null;
    if (!uri) {
      setImgSize(null);
      return;
    }
    Image.getSize(
      uri,
      (w, h) => setImgSize({ w, h }),
      () => setImgSize(null)
    );
  }, [letter?.photoUrl]);

  // user id 정규화: 여러 후보 필드에서 찾아 숫자로 변환
  const rawUserId = (user as any)?.id ?? (user as any)?.userId ?? (user as any)?.user_id ?? null;
  const parsedUserId = rawUserId != null ? Number(rawUserId) : NaN;
  const currentUserId = !isNaN(parsedUserId) ? parsedUserId : null;

  useEffect(() => {
    navigation.setOptions({ title: '편지 내용' });
  }, [navigation]);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchLetterById(id);
        const raw = (res as any)?.data ?? res;
        const normalized = normalizeLetter(raw);
        setLetter(normalized);
        setAuthor(normalized?.author ?? null);
      } catch (e) {
        setError('편지를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // 상세 화면 진입 시 현재 사용자의 헌화 목록을 불러와 tributedIds를 채웁니다.
  useEffect(() => {
    if (!currentUserId) return;
    // 호출 실패는 무시하고 로컬 상태만 갱신
    void refreshTributes(currentUserId);
  }, [currentUserId, refreshTributes]);

  // 서버 기준으로 현재 사용자가 이 편지에 헌화했는지 판별
  useEffect(() => {
    const checkMyTribute = async () => {
      try {
        if (!id || !currentUserId) return;
        const listRes = await fetchLetterTributes(String(id));
        const arr = (listRes as any)?.data ?? listRes ?? [];
        const mine = Array.isArray(arr)
          ? arr.find((t: any) => String(t?.fromUserId) === String(currentUserId))
          : undefined;
        setHasMyTribute(Boolean(mine));
      } catch (e) {
        // ignore; keep previous state
      }
    };
    void checkMyTribute();
  }, [id, currentUserId]);

  const handleTribute = async () => {
    if (!letter) return;
    if (!currentUserId) {
      Alert.alert('로그인이 필요합니다.', '헌화하려면 로그인 후 다시 시도해 주세요.');
      return;
    }
    if (isTributing) return;

    // normalized letter.id 사용 (normalizeLetter로 보장)
    const letterId = String(letter.id ?? letter._raw?.id ?? '');
  const has = hasMyTribute;

    if (has) {
      setIsTributing(true);
      try {
        await toggleTribute(letterId, currentUserId);
        try {
          const res = await fetchLetterById(letterId);
          const raw = (res as any)?.data ?? res;
          const normalized = normalizeLetter(raw);
          setLetter(normalized);
          setAuthor(normalized?.author ?? null);
        } catch (e) {}
  // 서버 기준으로 다시 확인
  try { await refreshTributes(currentUserId); } catch {}
  setHasMyTribute(false);
  Alert.alert('헌화가 취소되었습니다');
      } finally {
        setIsTributing(false);
      }
      return;
    }

    // 메시지 선택 없이 즉시 헌화 생성
    setIsTributing(true);
    try {
      await toggleTribute(letterId, currentUserId);
      try {
        const res = await fetchLetterById(letterId);
        const raw = (res as any)?.data ?? res;
        const normalized = normalizeLetter(raw);
        setLetter(normalized);
        setAuthor(normalized?.author ?? null);
      } catch (e) {}
      try { await refreshTributes(currentUserId); } catch {}
      setHasMyTribute(true);
      Alert.alert('헌화가 완료되었습니다');
    } finally {
      setIsTributing(false);
    }
  };

  const ownerId = letter ? (letter.author?.id ?? letter.authorId ?? letter.author_id ?? letter._raw?.userId ?? letter._raw?.user_id ?? null) : null;
  const isOwner = Boolean(currentUserId && ownerId && String(ownerId) === String(currentUserId));

  const handleEdit = () => {
    if (!letter) return;
    // cast to any because LetterWriteScreen params may be undefined in RootStackParamList
    navigation.navigate('LetterWriteScreen' as any, { id: String(letter.id) });
  };

  const handleDelete = () => {
    if (!letter) return;
    Alert.alert('편지 삭제', '정말로 이 편지를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            // call API to delete the letter, support multiple id fields from original
            const rawId = letter.id ?? letter._raw?.id ?? letter._raw?.letterId ?? letter._raw?.letter_id ?? null;
            if (!rawId) throw new Error('invalid_letter_id');
            await deleteLetter(rawId);

            Alert.alert('삭제 완료', '편지가 삭제되었습니다.', [
              { text: '확인', onPress: () => navigation.goBack() }
            ]);
          } catch (e) {
            Alert.alert('삭제 실패', '편지를 삭제하는 중 오류가 발생했습니다.');
          }
        },
      },
    ]);
  };

  if (loading)
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>로딩 중...</Text>
      </View>
    );
  if (error)
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>{error}</Text>
      </View>
    );
  if (!letter)
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>편지를 찾을 수 없습니다.</Text>
      </View>
    );

  // 원본 이미지 사이즈로 표시: 화면 폭을 넘지 않게 축소, 업스케일 금지

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: '#666', marginBottom: 12 }}>{formatKoreanDate(letter.createdAt)}</Text>
        {(() => {
          const meName = user?.nickname ?? null;
          const isMine = ownerId != null && (ownerId === user?.userId || ownerId === (user as any)?.id);
          const displayName = author?.nickname ?? (isMine ? meName : null) ?? '작성자 정보 없음';
          return (
            <Text style={{ fontSize: 12, color: '#333', marginBottom: 6 }}>{`${displayName}님의 추억이에요.`}</Text>
          );
        })()}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{letter.content}</Text>
      {letter.photoUrl ? (() => {
        const uri = String(letter.photoUrl);
        const windowWidth = Dimensions.get('window').width;
        const horizontalPadding = 32; // screen padding p-4 => 16 * 2
        const maxWidth = Math.max(0, windowWidth - horizontalPadding);
        const ratio = PixelRatio.get();
        const natW = imgSize?.w ?? 0;
        const natH = imgSize?.h ?? 0;

        // dp 계산: px / ratio
        const natWDp = natW > 0 ? natW / ratio : maxWidth;
        const renderWidth = Math.min(natWDp, maxWidth);
        const renderHeight = natW > 0 ? (natH / natW) * renderWidth : 220;

        return (
          <Image
            source={{ uri }}
            style={{ width: renderWidth, height: renderHeight, borderRadius: 8, marginBottom: 12, alignSelf: 'center' }}
            resizeMode="contain"
          />
        );
      })() : null}
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 12 }}>
        {letter.tributeCount === 0
          ? '첫 번째로 헌화해 주세요.'
          : `${letter.tributeCount}개의 헌화를 받았어요.`}
      </Text>
      {letter && (
        <Button
          title={hasMyTribute ? '취소하기' : '헌화하기'}
          color={hasMyTribute ? '#888' : undefined}
          onPress={handleTribute}
          disabled={isTributing}
        />
      )}
      {isOwner && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <Button title="수정" onPress={handleEdit} />
          <Button title="삭제" color="#d9534f" onPress={handleDelete} />
        </View>
      )}
    </ScrollView>
  );
};

export default LetterDetailScreen;
