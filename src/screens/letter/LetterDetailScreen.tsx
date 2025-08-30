import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView } from 'react-native';
import axios from 'axios';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LetterDetail'>;

const LetterDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const id = route?.params?.id;
  const [letter, setLetter] = useState<any | null>(null);
  const [author, setAuthor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <View style={{flex:1, padding:16}}><Text>로딩 중...</Text></View>;
  if (error) return <View style={{flex:1, padding:16}}><Text>{error}</Text></View>;
  if (!letter) return <View style={{flex:1, padding:16}}><Text>편지를 찾을 수 없습니다.</Text></View>;

  return (
    <ScrollView style={{flex:1, padding:16}}>
      <Text style={{fontSize:18, fontWeight:'bold', marginBottom:8}}>{letter.content}</Text>
      <Text style={{fontSize:12, color:'#333', marginBottom:6}}>{author?.nickname ?? letter.user_id ?? '작성자 정보 없음'}</Text>
      <Text style={{color:'#666', marginBottom:12}}>{letter.created_at}</Text>
    </ScrollView>
  );
};

export default LetterDetailScreen;
