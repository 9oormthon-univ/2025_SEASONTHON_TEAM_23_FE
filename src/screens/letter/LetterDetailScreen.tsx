import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, Button, Alert, Image } from 'react-native';
import axios from 'axios';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { useTribute } from '@/provider/TributeProvider';
import { formatKoreanDate } from '@/utils/formatDate';

type Props = NativeStackScreenProps<RootStackParamList, 'LetterDetail'>;

const LetterDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const id = route?.params?.id;
  const [letter, setLetter] = useState<any | null>(null);
  const [author, setAuthor] = useState<any | null>(null);
  const { tributedIds, toggleTribute } = useTribute();
  const [userId, setUserId] = useState<string | null>(null);
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
  const handleTribute = async () => {
    if (!letter) return;
    if (!userId) {
      Alert.alert('사용자 정보를 불러오지 못했습니다.');
      return;
    }
    const has = tributedIds.has(letter.id);
    // call provider to toggle tribute
    await toggleTribute(letter.id, userId);
    // refresh letter data from server
    try {
      const res = await axios.get(`http://10.0.2.2:3001/letters/${letter.id}`);
      setLetter(res.data);
    } catch (e) {
      // ignore
    }
    // show alert
    if (has) Alert.alert('헌화가 취소되었습니다');
    else Alert.alert('헌화가 완료되었습니다');
  };

  if (loading) return <View style={{flex:1, padding:16}}><Text>로딩 중...</Text></View>;
  if (error) return <View style={{flex:1, padding:16}}><Text>{error}</Text></View>;
  if (!letter) return <View style={{flex:1, padding:16}}><Text>편지를 찾을 수 없습니다.</Text></View>;

  return (
    <ScrollView style={{flex:1, padding:16}}>
      <Text style={{color:'#666', marginBottom:12}}>{formatKoreanDate(letter.created_at)}</Text>
      <Text style={{fontSize:12, color:'#333', marginBottom:6}}>{`${author?.nickname ?? '작성자'}님의 추억이에요.`}</Text>
      <Text style={{fontSize:18, fontWeight:'bold', marginBottom:8}}>{letter.content}</Text>
      {letter.photo_url ? (
        <Image
          source={{ uri: String(letter.photo_url) }}
          style={{ width: '100%', height: 220, borderRadius: 8, marginBottom: 12 }}
          resizeMode="cover"
        />
      ) : null}
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 12 }}>
        {letter.tribute_count}개의 헌화를 받았어요.
      </Text>
      {letter && (
        <TouchableOpacity onPress={handleTribute} style={{ marginVertical: 8 }}>
          <Button
            title={`헌화하기`}
            color={tributedIds.has(letter.id) ? '#888' : undefined}
            onPress={handleTribute}
          />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default LetterDetailScreen;
