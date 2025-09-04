import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, Alert, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { useTribute } from '@/provider/TributeProvider';
import { useAuth } from '@/provider/AuthProvider';
import { formatKoreanDate } from '@/utils/formatDate';
import { fetchLetterById, deleteLetter, fetchTributes, deleteTributeById } from '@/services/letters';

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
  const { tributedIds, toggleTribute, fetchTributes: refreshTributes } = useTribute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTributing, setIsTributing] = useState(false);
  const { user } = useAuth();

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
    void refreshTributes();
  }, [currentUserId, refreshTributes]);

  const handleTribute = async () => {
    if (!letter) return;
    if (!currentUserId) {
      Alert.alert('로그인이 필요합니다.', '헌화하려면 로그인 후 다시 시도해 주세요.');
      return;
    }
    if (isTributing) return;

    // normalized letter.id 사용 (normalizeLetter로 보장)
    const letterId = String(letter.id ?? letter._raw?.id ?? '');
    const has = tributedIds.has(letterId);

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
        Alert.alert('헌화가 취소되었습니다');
      } finally {
        setIsTributing(false);
      }
      return;
    }

    Alert.alert('헌화 메시지 선택', '전달할 메시지를 선택하세요', [
      {
        text: 'THANKS.',
        onPress: async () => {
          setIsTributing(true);
          try {
            await toggleTribute(letterId, currentUserId, 'THANKS');
            try {
              const res = await fetchLetterById(letterId);
              const raw = (res as any)?.data ?? res;
              const normalized = normalizeLetter(raw);
              setLetter(normalized);
              setAuthor(normalized?.author ?? null);
            } catch (e) {}
            Alert.alert('헌화가 완료되었습니다');
          } finally {
            setIsTributing(false);
          }
        }
      },
      {
        text: '너무 안타까워요. 힘 내세요.',
        onPress: async () => {
          setIsTributing(true);
          try {
            await toggleTribute(letterId, currentUserId, 'SADNESS');
            try {
              const res = await fetchLetterById(letterId);
              const raw = (res as any)?.data ?? res;
              const normalized = normalizeLetter(raw);
              setLetter(normalized);
              setAuthor(normalized?.author ?? null);
            } catch (e) {}
            Alert.alert('헌화가 완료되었습니다');
          } finally {
            setIsTributing(false);
          }
        }
      },
      {
        text: '저도 같은 마음이에요. 함께 이겨내요.',
        onPress: async () => {
          setIsTributing(true);
          try {
            await toggleTribute(letterId, currentUserId, 'EMPATHY');
            try {
              const res = await fetchLetterById(letterId);
              const raw = (res as any)?.data ?? res;
              const normalized = normalizeLetter(raw);
              setLetter(normalized);
              setAuthor(normalized?.author ?? null);
            } catch (e) {}
            Alert.alert('헌화가 완료되었습니다');
          } finally {
            setIsTributing(false);
          }
        }
      },
      { text: '취소', style: 'cancel' }
    ]);
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
        }
      }
    ]);
  };

  const [isDeletingTribute, setIsDeletingTribute] = useState(false);

  const handleDeleteTribute = async () => {
    if (!letter) return;
    if (!currentUserId) {
      Alert.alert('로그인이 필요합니다.', '헌화를 취소하려면 로그인 후 다시 시도해 주세요.');
      return;
    }
    if (isDeletingTribute) return;

    const letterId = String(letter.id ?? letter._raw?.id ?? '');
    try {
      setIsDeletingTribute(true);
      // GET /letters/:id/tributes?fromUserId=... to find the tribute id
  // use provider fetchTributes via refreshTributes to get user's tributes
  // fetchTributes provider sets tributedIds; we still attempt to get server list for deletion
  await refreshTributes();
  const res = await fetchTributes(letterId, { fromUserId: currentUserId });
  const list = (res as any)?.data ?? res ?? [];
      const target = Array.isArray(list) ? list[0] : list;
      if (!target || !target.id) {
        Alert.alert('헌화 정보 없음', '삭제할 헌화가 없습니다.');
        return;
      }
      await deleteTributeById(target.id);

      // refresh letter detail and tribute state
      try {
        const r = await fetchLetterById(letterId);
        const raw = (r as any)?.data ?? r;
        const normalized = normalizeLetter(raw);
        setLetter(normalized);
        setAuthor(normalized?.author ?? null);
      } catch (e) {}
      // ask provider to refresh tributes for the current user
        try {
          await refreshTributes();
        } catch (e) {}

      Alert.alert('헌화 취소 완료', '헌화가 취소되었습니다.');
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 403) {
        Alert.alert('권한 오류', '헌화를 취소할 권한이 없습니다. 다시 로그인해 주세요.');
      } else {
        Alert.alert('오류', '헌화 취소 중 오류가 발생했습니다.');
      }
    } finally {
      setIsDeletingTribute(false);
    }
  };

  if (loading) return <View style={{ flex: 1, padding: 16 }}><Text>로딩 중...</Text></View>;
  if (error) return <View style={{ flex: 1, padding: 16 }}><Text>{error}</Text></View>;
  if (!letter) return <View style={{ flex: 1, padding: 16 }}><Text>편지를 찾을 수 없습니다.</Text></View>;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: '#666', marginBottom: 12 }}>{formatKoreanDate(letter.createdAt)}</Text>
      <Text style={{ fontSize: 12, color: '#333', marginBottom: 6 }}>{`${author?.nickname ?? '작성자 정보 없음'}님의 추억이에요.`}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{letter.content}</Text>
      {letter.photoUrl ? (
        <Image
          source={{ uri: String(letter.photoUrl) }}
          style={{ width: '100%', height: 220, borderRadius: 8, marginBottom: 12 }}
          resizeMode="cover"
        />
      ) : null}
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 12 }}>
        {letter.tributeCount === 0
          ? "첫 번째로 헌화해 주세요."
          : `${letter.tributeCount}개의 헌화를 받았어요.`}
      </Text>
      {letter && (
        <Button
          title="헌화하기"
          color={tributedIds.has(String(letter.id)) ? '#888' : undefined}
          onPress={handleTribute}
          disabled={isTributing}
        />
      )}
      {/* 임시: 사용자가 헌화한 경우 헌화 삭제 버튼 표시 (디버깅용) */}
      {tributedIds.has(String(letter.id)) && (
        <View style={{ marginTop: 12 }}>
          <Button title="헌화 삭제 (임시)" color="#d9534f" onPress={handleDeleteTribute} disabled={isDeletingTribute} />
        </View>
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
