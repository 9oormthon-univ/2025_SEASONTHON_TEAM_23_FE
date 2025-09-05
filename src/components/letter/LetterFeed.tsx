import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LetterStackParamList } from '@/types/navigation';
import { useAuth } from '@/provider/AuthProvider';
import { useTribute } from '@/provider/TributeProvider';
import { formatRelativeTime } from '@/utils/relativeTime';
import { fetchLetters } from '@/services/letters';

type NavProp = NativeStackNavigationProp<LetterStackParamList>;

const LetterFeed: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [letters, setLetters] = useState<any[]>([]);
  const { tributedIds, fetchTributes } = useTribute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // 타임아웃 헬퍼: 주어진 Promise에 ms 밀리초 이후 타임아웃 적용
  const withTimeout = useCallback(<T,>(p: Promise<T>, ms = 3000) => {
    return new Promise<T>((resolve, reject) => {
      const id = setTimeout(() => {
        reject(new Error('timeout'));
      }, ms);
      p.then((res) => {
        clearTimeout(id);
        resolve(res);
      }).catch((err) => {
        clearTimeout(id);
        reject(err);
      });
    });
  }, []);

  // 실제 데이터 로드 함수 (타임아웃 적용)
  const loadLetters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await withTimeout(fetchLetters(), 3000);
      const lettersData = (res as any)?.data ?? res;
      const arr = Array.isArray(lettersData) ? lettersData : (lettersData?.content ?? []);
      const visible = arr.filter((l: any) => l.isPublic === true);
      setLetters(visible);
    } catch (e: any) {
      if (e?.message === 'timeout') {
        setError('요청이 너무 오래 걸립니다. 잠시 후 다시 시도하세요.');
      } else {
        setError('편지 데이터를 불러오지 못했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchLetters, withTimeout]);

  // 처음에 받아오는 편지
  useEffect(() => {
    void loadLetters();
  }, [loadLetters]);

  // 상세에서 돌아올때 새로고침 (refetch)
  useFocusEffect(
    useCallback(() => {
      void loadLetters();
    }, [loadLetters])
  );

  // 헌화 상태를 Provider에서 동기화
  useEffect(() => {
    if (user?.userId) fetchTributes(user.userId);
  }, [user?.userId, fetchTributes]);

  // tribute toggle is handled inside detail screen; no direct button here

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {loading ? (
        <Text>로딩 중...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={letters}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderColor: '#eee',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('LetterDetail', { id: String(item.id) })}
                style={{ flex: 1, marginRight: 12 }}
              >
                <Text style={{ fontWeight: 'bold' }}>{item.content}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 }}>
                  <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>
                    {item.author?.nickname ? `${item.author.nickname}` : '작성자 정보 없음'}
                    {item.createdAt ? ` · ${formatRelativeTime(item.createdAt)}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{ width: 96, alignItems: 'flex-end' }}>
                <Text
                  style={{ color: tributedIds.has(String(item.id)) ? '#888' : undefined }} //이미 헌화한 편지면 회색
                >
                  {`🌸 ${item.tributeCount ?? 0}`}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>편지가 없습니다.</Text>}
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );
};

export default LetterFeed;
