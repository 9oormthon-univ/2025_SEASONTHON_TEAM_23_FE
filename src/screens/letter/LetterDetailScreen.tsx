import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, Image, Pressable, Platform } from 'react-native';
import { Modal } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LetterStackParamList } from '@/types/navigation';
import { useTribute } from '@/provider/TributeProvider';
import { useAuth } from '@/provider/AuthProvider';
import { formatKoreanDate } from '@/utils/formatDate';
import { useLetterDetail } from '@/hooks/queries/useLetterDetail';
import { useDeleteLetter } from '@/hooks/mutations/useDeleteLetter';
import { useLetterTributes } from '@/hooks/queries/useLetterTributes';
import Loader from '@common/Loader';
import Icon from '@common/Icon';
import { setHeaderExtras } from '@/types/Header';
import DropDownMenu from '@/components/common/DropDownMenu';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';

type Props = NativeStackScreenProps<LetterStackParamList, 'LetterDetail'>;
const LetterDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const id = route?.params?.id;
  const { toggleTribute } = useTribute();
  const [isTributing, setIsTributing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);
  const openImageModal = useCallback(() => setImageModalVisible(true), []);
  const closeImageModal = useCallback(() => setImageModalVisible(false), []);
  const { user } = useAuth();

  const currentUserId = (user as any)?.userId ?? null;

  const { data: letter, isLoading, error } = useLetterDetail(id);
  const { data: tributesData } = useLetterTributes(String(id));
  const { mutateAsync: deleteLetterAsync } = useDeleteLetter();
  const qc = useQueryClient();

  const tributes = tributesData?.data ?? tributesData ?? [];
  const hasMyTribute = Boolean(
    Array.isArray(tributes) &&
      tributes.find((t: any) => String(t?.fromUserId) === String(currentUserId))
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: '기억의 별자리' });
  }, [navigation]);

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
        qc.invalidateQueries({ queryKey: ['letter-detail', letterId] });
        qc.invalidateQueries({ queryKey: ['letter-tributes', letterId] });
        Alert.alert('위로의 별 전달이 취소되었습니다');
      } finally {
        setIsTributing(false);
      }
      return;
    }

    setIsTributing(true);
    try {
      await toggleTribute(letterId, currentUserId);
      qc.invalidateQueries({ queryKey: ['letter-detail', letterId] });
      qc.invalidateQueries({ queryKey: ['letter-tributes', letterId] });
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
      onBack: () => navigation.replace('LetterScreen'),
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
      await deleteLetterAsync(rawId);
      setConfirmVisible(false);
      navigation.goBack();
    } catch (e) {
      Alert.alert('삭제 실패', '편지를 삭제하는 중 오류가 발생했습니다.');
    }
  }, [letter, deleteLetterAsync, navigation]);

  if (isLoading) return <Loader isPageLoader />;
  if (error)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-7">
        <Text className="subHeading3 px-9 py-2 text-center text-error">{`⚠️ 편지 정보를 불러오지 못했어요.`}</Text>
        <Text className="body1 pb-4 text-error">{String(error)}</Text>
      </View>
    );
  if (!letter)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-7">
        <Text className="body1 pb-4 text-error">{`편지를 찾을 수 없어요.`}</Text>
      </View>
    );

  return (
    <>
      <ScrollView className="bg-bg">
        <View className="gap-24 px-7 pb-[60px] pt-10">
          <View className="gap-7">
            <View className="gap-4">
              <View className="items-center gap-6">
                <View className="items-center gap-2">
                  {Platform.OS === 'ios' ? (
                    <Image
                      source={require('@images/star-sky.png')}
                      style={{ width: 128, aspectRatio: 124 / 88 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Icon name="IcStarSky" width={123} height={88} />
                  )}
                  <Text className="body2 text-gray-600">{formatKoreanDate(letter.createdAt)}</Text>
                </View>
                {(() => {
                  const display = letter.nickname ?? '작성자 정보 없음';
                  return (
                    <Text className="subHeading3 text-center !leading-7 text-white">
                      {`${display}님의 추억이에요.`}
                    </Text>
                  );
                })()}
              </View>
              <View
                className={`gap-4 rounded-[20px] border border-[#2D3342] bg-bg px-5 ${letter.photoUrl ? 'py-5' : 'py-10'}`}
              >
                {letter.photoUrl ? (
                  <Pressable onPress={openImageModal} className="self-center">
                    <Image
                      source={{ uri: String(letter.photoUrl) }}
                      className="aspect-square w-[225px] rounded-[20px] bg-[#464646]"
                      resizeMode="cover"
                    />
                  </Pressable>
                ) : null}
                <Text className="body1 !leading-6 text-white">{letter.content}</Text>
              </View>
            </View>
            <View className="items-center gap-2">
              <View className="flex-row items-center gap-2 p-1">
                {Platform.OS === 'ios' ? (
                  <Image
                    source={require('@images/mini-star.png')}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                ) : (
                  <Icon name="IcStar" size={24} />
                )}
                {Number(letter?.tributeCount ?? 0) === 0 ? (
                  <Text className="body2 text-gray-400">첫 위로의 별을 전달해 보세요.</Text>
                ) : (
                  <Text className="body2 gap-1 text-gray-400">
                    <Text className="text-white">{letter.tributeCount}</Text>
                    {` 개의 위로의 별을 받았어요.`}
                  </Text>
                )}
              </View>
            </View>
          </View>
          {letter && (
            <Pressable
              disabled={isTributing}
              onPress={handleTribute}
              className="rounded-2xl py-4"
              style={{ backgroundColor: hasMyTribute ? '#FFEBB5' : '#FFD86F' }}
            >
              <Text
                className="subHeading2B text-center !leading-8"
                style={{ color: hasMyTribute ? '#585858' : '#060C1A' }}
              >
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
                accessibilityLabel="닫기 버튼"
                accessibilityRole="button"
                hitSlop={12}
                className="absolute right-6 top-[50px] p-1"
              >
                <Text className="heading2B text-white">×</Text>
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
    </>
  );
};

export default LetterDetailScreen;
