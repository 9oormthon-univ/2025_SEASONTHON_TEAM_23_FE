import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, Image, Pressable, Platform } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LetterStackParamList } from '@/types/navigation';
import { useTribute } from '@/provider/TributeProvider';
import { useAuth } from '@/provider/AuthProvider';
import { formatKoreanDate } from '@/utils/formatDate';
import {
  fetchLetterById,
  deleteLetter,
  fetchTributes as fetchLetterTributes,
} from '@/services/letters';
import Loader from '@common/Loader';
import Icon from '@common/Icon';
import { setHeaderExtras } from '@/types/Header';
import DropDownMenu from '@/components/common/DropDownMenu';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';

type Props = NativeStackScreenProps<LetterStackParamList, 'LetterDetail'>;

const LetterDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const id = route?.params?.id;
  const [letter, setLetter] = useState<any | null>(null); // 백엔드 camelCase 그대로 저장
  const { toggleTribute, fetchTributes: refreshTributes } = useTribute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTributing, setIsTributing] = useState(false);
  const [hasMyTribute, setHasMyTribute] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);
  const { user } = useAuth();

  // (이미지 원본 크기 표시 로직 제거: 디자인 상 고정 높이 사용)

  // camelCase 기준 단순 userId
  const currentUserId = (user as any)?.userId ?? null;

  useEffect(() => {
    navigation.setOptions({ title: '기억의 별자리' });
  }, [navigation]);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
  const res = await fetchLetterById(id);
  const raw = (res as any)?.data ?? res;
  setLetter(raw);
      } catch (e) {
        setError('편지를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // 상세 화면 진입 시 현재 사용자의 헌화 목록을 불러와 tributedIds를 채웁니다.
  useEffect(() => {
    if (!currentUserId) return;
    // 호출 실패는 무시하고 로컬 상태만 갱신
    void refreshTributes(currentUserId);
  }, [currentUserId, refreshTributes]);

  // 서버 기준으로 현재 사용자가 이 편지에 헌화했는지 판별
  useEffect(() => {
    const checkMyTribute = async () => {
      try {
        if (!id || !currentUserId) return;
        const listRes = await fetchLetterTributes(String(id));
        const arr = (listRes as any)?.data ?? listRes ?? [];
        const mine = Array.isArray(arr)
          ? arr.find((t: any) => String(t?.fromUserId) === String(currentUserId))
          : undefined;
        setHasMyTribute(Boolean(mine));
      } catch (e) {
        // ignore; keep previous state
      }
    };
    void checkMyTribute();
  }, [id, currentUserId]);

  const handleTribute = async () => {
    if (!letter) return;
    if (!currentUserId) {
      Alert.alert('로그인이 필요합니다.', '별을 전달하려면 로그인 후 다시 시도해 주세요.');
      return;
    }
    if (isTributing) return;

  const letterId = String(letter.id ?? '');
    const has = hasMyTribute;

    if (has) {
      setIsTributing(true);
      try {
        await toggleTribute(letterId, currentUserId);
        try {
          const res = await fetchLetterById(letterId);
          const raw = (res as any)?.data ?? res;
          setLetter(raw);
        } catch (e) {}
        // 서버 기준으로 다시 확인
        try {
          await refreshTributes(currentUserId);
        } catch {}
        setHasMyTribute(false);
        Alert.alert('위로의 별 전달이 취소되었습니다');
      } finally {
        setIsTributing(false);
      }
      return;
    }

    // 메시지 선택 없이 즉시 헌화 생성
    setIsTributing(true);
    try {
      await toggleTribute(letterId, currentUserId);
      try {
        const res = await fetchLetterById(letterId);
        const raw = (res as any)?.data ?? res;
        setLetter(raw);
      } catch (e) {}
      try {
        await refreshTributes(currentUserId);
      } catch {}
      setHasMyTribute(true);
    } finally {
      setIsTributing(false);
    }
  };

  const ownerId = letter?.userId ?? null;
  const isOwner = Boolean(currentUserId && ownerId && String(ownerId) === String(currentUserId));

  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      title: '기억의 별자리',
      hasBack: true,
      ...(isOwner
        ? {
            hasButton: true,
            icon: 'IcVerticalDots',
            iconSize: 38,
            iconColor: 'white',
            onPress: openMenu,
          }
        : { hasButton: false }),
    });
  }, [navigation, isOwner, openMenu]);

  const handleEdit = () => {
    if (!letter) return;
    // cast to any because LetterWriteScreen params may be undefined in RootStackParamList
    navigation.navigate('LetterWriteScreen' as any, { id: String(letter.id) });
  };

  const openDeleteConfirm = useCallback(() => {
    setMenuVisible(false);
    setConfirmVisible(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!letter) return;
    try {
      const rawId = letter.id;
      if (!rawId) throw new Error('invalid_letter_id');
      await deleteLetter(rawId);
      setConfirmVisible(false);
      // 성공 시 추가 Alert 없이 바로 이전 화면으로 이동
      navigation.goBack();
    } catch (e) {
      Alert.alert('삭제 실패', '편지를 삭제하는 중 오류가 발생했습니다.');
    }
  }, [letter, navigation]);

  if (loading) return <Loader />;
  if (error)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-7">
        <Text className="subHeading3 px-9 py-2 text-center text-error">{`⚠️ 편지 정보를 불러오지 못했어요.`}</Text>
        <Text className="body1 pb-4 text-error">{error}</Text>
      </View>
    );
  if (!letter)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-7">
        <Text className="body1 pb-4 text-error">{`편지를 찾을 수 없어요.`}</Text>
      </View>
    );

  // 원본 이미지 사이즈로 표시: 화면 폭을 넘지 않게 축소, 업스케일 금지

  return (
    <View style={{ flex: 1, backgroundColor: '#121826' }}>
      <ScrollView
        style={{ backgroundColor: '#121826' }}
        contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 100 }}
      >
        <View className="items-center">
          {/* 상단 별 아이콘: iOS에서는 PNG로 대체 */}
          {Platform.OS === 'ios' ? (
            <Image
              source={require('@images/star-sky.png')}
              style={{ width: 128, aspectRatio: 124 / 88 }}
              resizeMode="contain"
            />
          ) : (
            <Icon name="IcStarSky" size={128} />
          )}
          {/* 날짜 */}
          <Text className="body2 mt-6" style={{ color: '#AAAAAA' }}>
            {formatKoreanDate(letter.createdAt)}
          </Text>
          {/* 제목 (닉네임 문구) */}
          {(() => {
            const display = letter.nickname ?? '작성자 정보 없음';
            return (
              <Text
                className="mt-6 text-center text-white"
                style={{ fontSize: 14, fontWeight: '600', lineHeight: 20 }}
              >
                {`${display}님의 추억이에요.`}
              </Text>
            );
          })()}
          {/* 내용 카드 */}
          <View className="mt-10 w-full rounded-2xl border border-white/10 bg-[#121826] p-6">
            {letter.photoUrl ? (
              <Image
                source={{ uri: String(letter.photoUrl) }}
                className="mb-5 h-[220px] rounded-lg"
                resizeMode="cover"
              />
            ) : null}
            <Text className="body1 leading-6" style={{ color: '#F2F2F2' }}>
              {letter.content}
            </Text>
          </View>
          {/* 별 카운트 */}
          <View className="mt-14 items-center">
            <View className="flex-row items-center gap-2">
              {Platform.OS === 'ios' ? (
                <Image
                  source={require('@images/mini-star.png')}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
              ) : (
                <Icon name="IcStar" size={20} color="#F2F2F2" />
              )}
              {Number(letter?.tributeCount ?? 0) === 0 ? (
                <Text className="body2" style={{ color: '#F2F2F2' }}>
                  첫 위로의 별을 전달해 보세요.
                </Text>
              ) : (
                <Text className="body2" style={{ color: '#F2F2F2' }}>
                  <Text style={{ color: '#F2F2F2', fontWeight: '600' }}>{letter.tributeCount}</Text>
                  {` 개의 위로의 별을 받았어요.`}
                </Text>
              )}
            </View>
          </View>
          {/* 버튼 */}
          {letter && (
            <Pressable
              disabled={isTributing}
              onPress={handleTribute}
              className="mt-8 w-full rounded-2xl py-4"
              style={{
                backgroundColor: hasMyTribute ? '#E6D08F' : '#FFD86F',
                opacity: isTributing ? 0.7 : 1,
              }}
            >
              <Text className="subHeading2B text-center text-black">
                {hasMyTribute ? '취소하기' : '위로의 별 전달'}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
      {isOwner && (
        <>
          <DropDownMenu
            visible={menuVisible}
            onDismiss={closeMenu}
            onEdit={handleEdit}
            onDelete={openDeleteConfirm}
          />
          <ConfirmDeleteModal
            visible={confirmVisible}
            helperText={`글을 삭제하면 되돌릴 수 없어요.\n비공개 설정하는 것은 어떨까요?`}
            onCancel={() => setConfirmVisible(false)}
            onConfirm={handleDelete}
          />
        </>
      )}
    </View>
  );
};

export default LetterDetailScreen;