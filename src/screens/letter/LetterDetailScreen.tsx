import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/provider/AuthProvider';
import { formatKoreanDate } from '@/utils/formatDate';

type Props = NativeStackScreenProps<RootStackParamList, 'LetterDetail'>;

// local fallback user id taken from db.json for development without authentication
const LOCAL_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

const LetterDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const id = route?.params?.id;
  const [letter, setLetter] = useState<any | null>(null);
  const [author, setAuthor] = useState<any | null>(null);
  const [tributedIds, setTributedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({ title: '편지 내용' });
  }, [navigation]);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://10.0.2.2:3001/letters/${id}`);
        setLetter(res.data);
        // try to fetch author info: if letter contains nickname, use it; else use user_id
        const nick = res.data?.nickname ?? null;
        const userIdentifier = nick ?? res.data?.user_id ?? null;
        if (userIdentifier) {
          try {
            const userRes = await axios.get(`http://10.0.2.2:3001/users/${userIdentifier}`);
            setAuthor(userRes.data);
          } catch (userErr) {
            // ignore user fetch error, author stays null
            setAuthor(null);
          }
        }
      } catch (e) {
        setError('편지를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('tributed_letters');
        if (raw) setTributedIds(new Set(JSON.parse(raw) as string[]));
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const persistTributed = async (set: Set<string>) => {
    try {
      await AsyncStorage.setItem('tributed_letters', JSON.stringify(Array.from(set)));
    } catch (e) {
      // ignore
    }
  };

  const handleTribute = async () => {
    if (!letter) return;
    const has = tributedIds.has(letter.id);
    const prevLetter = letter;

    // optimistic
    setLetter({ ...letter, tribute_count: (letter.tribute_count ?? 0) + (has ? -1 : 1) });
    const newSet = new Set(tributedIds);
    if (has) newSet.delete(letter.id);
    else newSet.add(letter.id);
    setTributedIds(newSet);
    await persistTributed(newSet);

    try {
      const nextCount = (prevLetter.tribute_count ?? 0) + (has ? -1 : 1);
      await axios.patch(`http://10.0.2.2:3001/letters/${letter.id}`, { tribute_count: nextCount });
    } catch (e) {
      // rollback
      setLetter(prevLetter);
      setTributedIds(tributedIds);
      await persistTributed(tributedIds);
    }
  };

  const handleEdit = () => {
    // navigate to write screen with id for editing
    navigation.navigate('LetterWriteScreen' as any, { id: letter?.id });
  };

  const handleDelete = async () => {
    if (!letter) return;
    // require exact match of user id === letter.user_id to allow deletion
    const u = user as any;
    const currentUserId = (u && u.id) ? u.id : LOCAL_USER_ID;
    if (!currentUserId || currentUserId !== letter.user_id) {
      Alert.alert('권한 없음', '이 편지는 삭제할 수 없습니다.');
      return;
    }

    Alert.alert('삭제', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: async () => {
        try {
          await axios.delete(`http://10.0.2.2:3001/letters/${letter.id}`);
          navigation.goBack();
        } catch (e) {
          Alert.alert('오류', '삭제에 실패했습니다.');
        }
      } }
    ]);
  };

  if (loading) return <View style={{flex:1, padding:16}}><Text>로딩 중...</Text></View>;
  if (error) return <View style={{flex:1, padding:16}}><Text>{error}</Text></View>;
  if (!letter) return <View style={{flex:1, padding:16}}><Text>편지를 찾을 수 없습니다.</Text></View>;

  return (
    <ScrollView style={{flex:1, padding:16}}>
      <Text style={{fontSize:18, fontWeight:'bold', marginBottom:8}}>{letter.content}</Text>
  <Text style={{fontSize:12, color:'#333', marginBottom:6}}>{author?.nickname ?? letter.user_id ?? '작성자 정보 없음'}</Text>
  {/* show flower button if current user is not the author (we compare using userId fetched elsewhere; fallback: show) */}
  {letter && (
        <View style={{ marginVertical: 8 }}>
          <TouchableOpacity onPress={handleTribute} style={{ paddingVertical: 8 }}>
            <Text>🌸 {letter.tribute_count ?? 0}</Text>
          </TouchableOpacity>
          {/* show edit/delete only when current user is the author */}
          {(() => {
            const u = user as any;
            // determine current user id: prefer authenticated user's id, otherwise use local fallback
            const currentUserId = (u && u.id) ? u.id : LOCAL_USER_ID;
            const isAuthor = Boolean(currentUserId && letter && currentUserId === letter.user_id);
            return isAuthor;
          })() && (
            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <TouchableOpacity onPress={handleEdit} style={{ marginRight: 12, padding: 8, backgroundColor: '#ccc', borderRadius: 6 }}>
                <Text>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={{ padding: 8, backgroundColor: '#f66', borderRadius: 6 }}>
                <Text style={{ color: '#fff' }}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
  <Text style={{color:'#666', marginBottom:12}}>{formatKoreanDate(letter.created_at)}</Text>
    </ScrollView>
  );
};

export default LetterDetailScreen;
