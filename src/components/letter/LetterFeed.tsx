import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Image, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LetterStackParamList } from '@/types/navigation';
import { useAuth } from '@/provider/AuthProvider';
import { useTribute } from '@/provider/TributeProvider';

import { useLetters } from '@/hooks/queries/useLetters';
import Loader from '../common/Loader';
import Icon from '@common/Icon';
import { formatRelativeKo } from '@/utils/formatDate';

type NavProp = NativeStackNavigationProp<LetterStackParamList>;

const LetterFeed: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { fetchTributes } = useTribute();
  const { user } = useAuth();

  const { data: lettersData, isLoading, error, refetch } = useLetters();
  const letters = lettersData?.data ?? lettersData ?? [];
  const visibleLetters = letters.filter((l: any) => l.isPublic === true);

  // 상세에서 돌아올때 새로고침 (refetch)
  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  // 헌화 상태를 Provider에서 동기화
  useEffect(() => {
    if (user?.userId) fetchTributes(user.userId);
  }, [user?.userId, fetchTributes]);

  // tribute toggle is handled inside detail screen; no direct button here

  return (
    <View className="flex-1 gap-1">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <View className="flex-1 items-center justify-center p-7">
          <Text className="body1 pb-4 text-error">{String(error)}</Text>
        </View>
      ) : (
        <FlatList
          data={visibleLetters}
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
                android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              >
                <View className="gap-2">
                  <View className="flex-row gap-2">
                    {photoUri && (
                      <Image
                        source={{ uri: String(photoUri) }}
                        className="h-20 w-20 rounded-xl bg-[#464646]"
                        resizeMode="cover"
                      />
                    )}
                    <Text className="body1 py-2 !leading-6 text-white" numberOfLines={6}>
                      {item.content}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1">
                      <Text className="body3 text-gray-300">{display}</Text>
                      <View className="h-0.5 w-0.5 rounded-full bg-gray-100" />
                      <Text className="captionSB text-gray-100">
                        {timeText ? `${formatRelativeKo(timeText)}` : ''}
                      </Text>
                    </View>
                    <View className="min-w-14 flex-row items-center gap-1">
                      {Platform.OS === 'ios' ? (
                        <Image
                          source={require('@images/mini-star.png')}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      ) : (
                        <Icon name="IcStar" size={20} />
                      )}
                      <Text className="body3 flex-1 text-center text-gray-100">
                        {item.tributeCount ?? 0}
                      </Text>
                    </View>
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
