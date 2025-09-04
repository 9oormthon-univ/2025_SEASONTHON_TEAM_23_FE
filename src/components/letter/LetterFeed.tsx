import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import axios from 'axios';
import { useAuth } from '@/provider/AuthProvider';
import { useTribute } from '@/provider/TributeProvider';
import { formatRelativeTime } from '@/utils/relativeTime';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const LetterFeed: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [letters, setLetters] = useState<any[]>([]);
  const { tributedIds, toggleTribute, fetchTributes } = useTribute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // user is provided by AuthProvider

  const fetchLetters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = 'http://10.0.2.2:3001/letters';
      const [lettersRes, usersRes] = await Promise.all([
        axios.get(url),
        axios.get('http://10.0.2.2:3001/users'),
      ]);
      const usersMap: Record<string, any> = {};
      for (const u of usersRes.data) {
        usersMap[u.id] = u;
      }
      const lettersWithAuthor = lettersRes.data
        .map((l: any) => ({
          ...l,
          // db.json uses camelCase keys (userId, tributeCount, photoUrl)
          author: usersMap[l.userId] || null,
        }))
        // only expose public letters in the feed
        .filter((l: any) => l.isPublic === true);
      setLetters(lettersWithAuthor);
    } catch (e: any) {
      setError('편지 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 처음에 받아오는 편지
  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  // 상세에서 돌아올때 새로고침 (refetch)
  useFocusEffect(
    useCallback(() => {
      fetchLetters();
    }, [fetchLetters])
  );

  // 헌화 상태를 Provider에서 동기화
  useEffect(() => {
    if (user?.userId) fetchTributes(user.userId);
  }, [user?.userId, fetchTributes]);

  const handleTributePress = async (letterId: string) => {
    if (user?.userId) {
      await toggleTribute(letterId, user.userId);
      await fetchLetters();
    }
  };

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
                <Button
                  title={`🌸 ${item.tributeCount ?? 0}`}
                  color={tributedIds.has(String(item.id)) ? '#d3d3d3' : undefined}
                  onPress={() => handleTributePress(String(item.id))}
                />
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
