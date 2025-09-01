import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import axios from 'axios';
import { useTribute } from '@/provider/TributeProvider';
import { useLetterFilter } from './LetterContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const LetterFeed: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { showMyLetters } = useLetterFilter();
  const [letters, setLetters] = useState<any[]>([]);
  const { tributedIds, toggleTribute, fetchTributes } = useTribute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get('http://10.0.2.2:3001/users');
        setUserId(res.data[0]?.id ?? null);
      } catch (e) {
        setUserId(null);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    // fetch handled by fetchLetters below
  }, [showMyLetters, userId]);

  const fetchLetters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://10.0.2.2:3001/letters';
      if (showMyLetters && userId) {
        url += `?user_id=${userId}`;
      }
      const [lettersRes, usersRes] = await Promise.all([
        axios.get(url),
        axios.get('http://10.0.2.2:3001/users')
      ]);
      const usersMap: Record<string, any> = {};
      for (const u of usersRes.data) {
        usersMap[u.id] = u;
      }
      const lettersWithAuthor = lettersRes.data.map((l: any) => ({
        ...l,
        author: usersMap[l.user_id] || null
      }));
      setLetters(lettersWithAuthor);
    } catch (e: any) {
      setError('편지 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [showMyLetters, userId]);

  // initial fetch
  useEffect(() => {
    if (!showMyLetters || userId) fetchLetters();
  }, [showMyLetters, userId, fetchLetters]);

  // refetch when this screen gains focus (e.g., returning from detail)
  useFocusEffect(
    useCallback(() => {
      if (!showMyLetters || userId) fetchLetters();
    }, [showMyLetters, userId, fetchLetters])
  );

  // 헌화 상태를 Provider에서 동기화
  useEffect(() => {
    if (userId) fetchTributes(userId);
  }, [userId, fetchTributes]);

  const handleTributePress = async (letterId: string) => {
    console.log('handleTributePress called with:', letterId, 'userId:', userId);
    if (userId) {
      console.log('Before toggleTribute');
      // Provider의 toggleTribute 호출
      await toggleTribute(letterId, userId);
      console.log('After toggleTribute');
      // 편지 목록 다시 불러오기
      await fetchLetters();
      console.log('After fetchLetters');
    } else {
      console.log('No userId available');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
        {showMyLetters ? '내가 쓴 편지 목록' : '모두의 편지 목록'}
      </Text>
      {loading ? (
        <Text>로딩 중...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={letters}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.navigate('LetterDetail', { id: String(item.id) })} style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.content}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 }}>
                  <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>
                    {item.author?.nickname ? `${item.author.nickname}` : '작성자: 익명'}
                  </Text>
                  <Button
                    title={`🌸 ${item.tribute_count ?? 0}`}
                    color={tributedIds.has(item.id) ? '#d3d3d3' : undefined}
                    onPress={() => handleTributePress(item.id)}
                  />
                </View>
              </TouchableOpacity>
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
