import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LetterStackParamList } from '@/types/navigation';
import { useAuth } from '@/provider/AuthProvider';
import { useTribute } from '@/provider/TributeProvider';
import { formatRelativeTime } from '@/utils/relativeTime';
import { fetchLetters } from '@/services/letters';
import Loader from '../common/Loader';
import Icon from '@common/Icon';

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
    <View className="flex-1 gap-1">
      {loading ? (
        <Loader />
      ) : error ? (
        <View className="flex-1 items-center justify-center p-7">
          <Text className="body1 pb-4 text-error">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={letters}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View className="gap-3 rounded-[20px] bg-bg-light px-6 py-4">
              <Pressable
                onPress={() => navigation.navigate('LetterDetail', { id: String(item.id) })}
              >
                <Text className="body1 !leading-6 text-body-100">{item.content}</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="body3 text-body-200">
                    {(() => {
                      const authorObj = item.author ?? item.user ?? null;
                      const authorId = item.authorId ?? item.author_id ?? item.userId ?? item.user_id ?? authorObj?.id ?? authorObj?.userId ?? null;
                      const authorName = authorObj?.nickname ?? authorObj?.name ?? authorObj?.displayName ?? null;
                      const mine = user && (authorId === user.userId || authorId === (user as any).id);
                      const display = authorName ?? (mine ? user?.nickname ?? null : null);
                      return (
                        <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>
                          {display ?? '작성자 정보 없음'}
                          {item.createdAt ? ` · ${formatRelativeTime(item.createdAt)}` : ''}
                        </Text>
                      );
                    })()}
                  </Text>
                  <View
                    className={`flex-row rounded-lg border border-gray-600 p-1 ${tributedIds.has(String(item.id)) ? 'bg-white/20' : 'bg-white/40'}`}
                  >
                    <View className="p-1">
                      <Icon name="IcFlower" size={16} color="#FFD86F" />
                    </View>
                    <Text className="body2 text-body-200">{`${item.tributeCount ?? 0}`}</Text>
                  </View>
                </View>
              </Pressable>
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
