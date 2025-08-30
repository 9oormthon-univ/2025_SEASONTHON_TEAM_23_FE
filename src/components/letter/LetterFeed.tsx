import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import axios from 'axios';
import { useLetterFilter } from './LetterContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const LetterFeed: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { showMyLetters } = useLetterFilter();
  const [letters, setLetters] = useState<any[]>([]);
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
    const fetchLetters = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = 'http://10.0.2.2:3001/letters';
        if (showMyLetters && userId) {
          url += `?user_id=${userId}`;
        }
        const res = await axios.get(url);
        setLetters(res.data);
      } catch (e: any) {
        setError('편지 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    if (!showMyLetters || userId) {
      fetchLetters();
    }
  }, [showMyLetters, userId]);

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
            <TouchableOpacity
              onPress={() => navigation.navigate('LetterDetail', { id: String(item.id) })}
              style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}
            >
              <Text style={{ fontWeight: 'bold' }}>{item.content}</Text>
              <Text style={{ color: '#888', fontSize: 12 }}>{item.created_at}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>편지가 없습니다.</Text>}
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );
};

export default LetterFeed;
