import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, Alert, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { useTribute } from '@/provider/TributeProvider';
import { useAuth } from '@/provider/AuthProvider';
import { formatKoreanDate } from '@/utils/formatDate';
import { fetchLetterById } from '@/services/letters';

type Props = NativeStackScreenProps<RootStackParamList, 'LetterDetail'>;

const LetterDetailScreen: React.FC<Props> = ({ route, navigation }) => {
   const id = route?.params?.id;
  const [letter, setLetter] = useState<any | null>(null);
  const [author, setAuthor] = useState<any | null>(null);
  const { tributedIds, toggleTribute } = useTribute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTributing, setIsTributing] = useState(false);
  const { user } = useAuth();

  const currentUserId = user?.userId

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
        const letterData = (res as any)?.data ?? res;
        setLetter(letterData);

        if (letterData?.author) {
          setAuthor(letterData.author);
        } else {
          setAuthor(null);
        }
      } catch (e) {
        setError('편지를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleTribute = async () => {
    if (!letter) return;
    if (!currentUserId) {
      Alert.alert('로그인이 필요합니다.', '헌화하려면 로그인 후 다시 시도해 주세요.');
      return;
    }
    if (isTributing) return;

    const letterId = String(letter.id);
    const has = tributedIds.has(letterId);

    if (has) {
      setIsTributing(true);
      try {
        await toggleTribute(letterId, currentUserId);
        try {
          const res = await fetchLetterById(letterId);
          const updated = (res as any)?.data ?? res;
          setLetter(updated);
        } catch (e) {}
        Alert.alert('헌화가 취소되었습니다');
      } finally {
        setIsTributing(false);
      }
      return;
    }

    Alert.alert('헌화 메시지 선택', '전달할 메시지를 선택하세요', [
      {
        text: '많이 힘드시죠? 기운 내세요.',
        onPress: async () => {
          setIsTributing(true);
          try {
            await toggleTribute(letterId, currentUserId, 'CONSOLATION');
            try {
              const res = await fetchLetterById(letterId);
              const updated = (res as any)?.data ?? res;
              setLetter(updated);
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
              const updated = (res as any)?.data ?? res;
              setLetter(updated);
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
              const updated = (res as any)?.data ?? res;
              setLetter(updated);
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

  const ownerId = letter ? (letter.userId ?? letter.user_id ?? null) : null;
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
            // after delete, go back to list
            navigation.goBack();
          } catch (e) {
            Alert.alert('삭제 실패', '편지를 삭제하는 중 오류가 발생했습니다.');
          }
        }
      }
    ]);
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
