import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Alert, Image, Pressable, Platform } from 'react-native';
import { Modal } from 'react-native';
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

// createdAt이 타임존이 없는 UTC 문자열인 경우(마이크로초 포함) UTC로 해석 후 Date 반환
const parseBackendUtc = (value: string | Date | null | undefined): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const str = String(value);
  // 패턴: YYYY-MM-DDTHH:mm:ss[.fraction]
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.(\d+))?$/);
  if (m) {
    const [, y, mo, d, h, mi, s, , frac] = m;
    const ms = (frac ?? '000').slice(0, 3).padEnd(3, '0');
    // 타임존 표기가 없으니 UTC 로 간주
    return new Date(
      Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s), Number(ms))
    );
  }
  // 이미 Z 또는 +오프셋이 있다면 기본 파서 사용
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const LetterDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const id = route?.params?.id;
  const [letter, setLetter] = useState<any | null>(null);
  const { toggleTribute, fetchTributes: refreshTributes } = useTribute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTributing, setIsTributing] = useState(false);
  const [hasMyTribute, setHasMyTribute] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);
  const openImageModal = useCallback(() => setImageModalVisible(true), []);
  const closeImageModal = useCallback(() => setImageModalVisible(false), []);
  const { user } = useAuth();

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

  useEffect(() => {
    if (!currentUserId) return;
    void refreshTributes(currentUserId);
  }, [currentUserId, refreshTributes]);

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
      } catch {}
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
        } catch {}
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

    setIsTributing(true);
    try {
      await toggleTribute(letterId, currentUserId);
      try {
        const res = await fetchLetterById(letterId);
        const raw = (res as any)?.data ?? res;
        setLetter(raw);
      } catch {}
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
      navigation.goBack();
    } catch (e) {
      Alert.alert('삭제 실패', '편지를 삭제하는 중 오류가 발생했습니다.');
    }
  }, [letter, navigation]);

  const formattedCreatedAt = useMemo(() => {
    const d = parseBackendUtc(letter?.createdAt ?? null);
    return d ? formatKoreanDate(d) : '';
  }, [letter?.createdAt]);

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

  return (
    <View style={{ flex: 1, backgroundColor: '#121826' }}>
      <ScrollView
        style={{ backgroundColor: '#121826' }}
        contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 100 }}
      >
        <View className="items-center">
          {Platform.OS === 'ios' ? (
            <Image
              source={require('@images/star-sky.png')}
              style={{ width: 128, aspectRatio: 124 / 88 }}
              resizeMode="contain"
            />
          ) : (
            <Icon name="IcStarSky" size={128} />
          )}
          <Text className="body2 mt-6" style={{ color: '#AAAAAA' }}>
            {formattedCreatedAt}
          </Text>
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
          <View className="mt-10 w-full rounded-2xl border border-white/10 bg-[#121826] p-6">
            {letter.photoUrl ? (
              <Pressable onPress={openImageModal} className="mb-5">
                <Image
                  source={{ uri: String(letter.photoUrl) }}
                  className="h-[220px] rounded-lg"
                  resizeMode="cover"
                />
              </Pressable>
            ) : null}
            <Text className="body1 leading-6" style={{ color: '#F2F2F2' }}>
              {letter.content}
            </Text>
          </View>
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
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <Pressable style={{ flex: 1 }} onPress={closeImageModal}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Pressable
                onPress={closeImageModal}
                hitSlop={12}
                style={{
                  position: 'absolute',
                  top: 50,
                  right: 24,
                  padding: 4,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 28, lineHeight: 28 }}>×</Text>
              </Pressable>
              {letter.photoUrl && (
                <Image
                  source={{ uri: String(letter.photoUrl) }}
                  style={{ width: '92%', height: '72%', resizeMode: 'contain' }}
                />
              )}
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default LetterDetailScreen;
