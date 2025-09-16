import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Image, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LetterStackParamList } from '@/types/navigation';
import { useAuth } from '@/provider/AuthProvider';
import { useTribute } from '@/provider/TributeProvider';

import { fetchLetters } from '@/services/letters';
import Loader from '../common/Loader';
import Icon from '@common/Icon';
import { formatRelativeKo } from '@/utils/formatDate';

type NavProp = NativeStackNavigationProp<LetterStackParamList>;

const LetterFeed: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [letters, setLetters] = useState<any[]>([]);
  const { fetchTributes } = useTribute();
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
          renderItem={({ item }) => {
            const authorObj = item.author ?? item.user ?? null;
            const authorId = item.userId ?? authorObj?.id ?? authorObj?.userId ?? null;
            const authorName =
              authorObj?.nickname ?? authorObj?.name ?? authorObj?.displayName ?? null;
            const mine = user && (authorId === user?.userId || authorId === (user as any)?.id);
            const display =
              item.nickname ??
              authorName ??
              (mine ? (user?.nickname ?? null) : null) ??
              '작성자 정보 없음';
            const timeText = item.createdAt ? item.createdAt : '';
            // 사진 후보 필드 추출 (다양한 API 형태 대응)
            const photoUri =
              item.photoUrl ||
              item.photo_url ||
              item.imageUrl ||
              item.image_url ||
              item.photo ||
              null;
            return (
              <Pressable
                className="rounded-[20px] bg-bg-light px-6 py-4"
                onPress={() => navigation.navigate('LetterDetail', { id: String(item.id) })}
              >
                {photoUri ? (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                    <Image
                      source={{ uri: String(photoUri) }}
                      style={{
                        width: 84,
                        height: 84,
                        borderRadius: 12,
                        backgroundColor: '#1F2A3C',
                      }}
                      resizeMode="cover"
                    />
                    <Text
                      className="body1 !leading-6"
                      style={{ color: '#F2F2F2', flex: 1 }}
                      numberOfLines={6}
                    >
                      {item.content}
                    </Text>
                  </View>
                ) : (
                  <Text className="body1 !leading-6" style={{ color: '#F2F2F2' }}>
                    {item.content}
                  </Text>
                )}
                <View className="mt-3 flex-row items-center justify-between">
                  <Text style={{ color: '#F2F2F2', fontSize: 12 }}>
                    {display}
                    {timeText ? ` · ${formatRelativeKo(timeText)}` : ''}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    {Platform.OS === 'ios' ? (
                      <Image
                        source={require('@images/mini-star.png')}
                        style={{ width: 20, height: 20 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Icon name="IcStar" size={20} color="#F2F2F2" />
                    )}
                    <Text style={{ color: '#F2F2F2', fontSize: 14, fontWeight: '300' }}>
                      {item.tributeCount ?? 0}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
          ListEmptyComponent={<Text>편지가 없습니다.</Text>}
          // style 제거: 간격은 contentContainerStyle로 처리
        />
      )}
    </View>
  );
};

export default LetterFeed;
