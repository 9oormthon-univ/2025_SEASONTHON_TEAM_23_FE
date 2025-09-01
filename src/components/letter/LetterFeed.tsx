import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import axios from 'axios';
import { useLetterFilter } from './LetterContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/provider/AuthProvider';
import { formatKoreanDate } from '@/utils/formatDate';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const LetterFeed: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { showMyLetters } = useLetterFilter();
  const { user } = useAuth();
  const [letters, setLetters] = useState<any[]>([]);
  const [tributedIds, setTributedIds] = useState<Set<string>>(new Set());
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
    // load tributed ids from storage
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('tributed_letters');
        if (raw) {
          const arr = JSON.parse(raw) as string[];
          setTributedIds(new Set(arr));
        }
      } catch (e) {
        // ignore
      }
    })();
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

  const persistTributed = async (set: Set<string>) => {
    try {
      await AsyncStorage.setItem('tributed_letters', JSON.stringify(Array.from(set)));
    } catch (e) {
      // ignore
    }
  };

  const toggleTribute = async (letterId: string) => {
    // check local record
    const has = tributedIds.has(letterId);
    const prevLetters = letters;

    // optimistic update
    setLetters(prev => prev.map(l => (l.id === letterId ? { ...l, tribute_count: (l.tribute_count ?? 0) + (has ? -1 : 1) } : l)));
    const newSet = new Set(tributedIds);
    if (has) newSet.delete(letterId);
    else newSet.add(letterId);
    setTributedIds(newSet);
    await persistTributed(newSet);

    try {
      // PATCH the letter tribute_count on server
      const target = letters.find(l => l.id === letterId);
      const nextCount = (target?.tribute_count ?? 0) + (has ? -1 : 1);
      await axios.patch(`http://10.0.2.2:3001/letters/${letterId}`, { tribute_count: nextCount });
    } catch (e) {
      // rollback on error: restore previous letters and tributedIds
      setLetters(prevLetters);
      setTributedIds(tributedIds);
      await persistTributed(tributedIds);
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
                    onPress={() => toggleTribute(item.id)}
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
