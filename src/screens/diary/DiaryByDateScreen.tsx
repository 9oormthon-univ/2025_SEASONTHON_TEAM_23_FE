import { View, Text, ScrollView, Pressable, Image, Platform } from 'react-native';
import { ACTIVE_UI, EMOJIS } from '@/constants/diary/emoji';
import Icon from '@common/Icon';
import TextArea from '@common/TextArea';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { DiaryStackParamList } from '@/types/navigation';
import { useDailyLogDetail } from '@/hooks/queries/useDailyLogDetail';
import { withKoreanDOW } from '@/utils/calendar/date';
import { emojiKeyFromNumber } from '@/utils/calendar/mood';
import Loader from '@common/Loader';
import { keepAllKorean } from '@/utils/keepAll';
import { useCallback, useLayoutEffect, useState } from 'react';
import { setHeaderExtras } from '@/types/Header';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DropDownMenu from '@common/DropDownMenu';
import ConfirmDeleteModal from '@common/ConfirmDeleteModal';
import { useDeleteDailyLog } from '@/hooks/mutations/useDeleteDailyLog';
import { useToast } from '@/provider/ToastProvider';

type DiaryByDateRoute = RouteProp<DiaryStackParamList, 'DiaryByDate'>;

const DiaryByDateScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DiaryStackParamList>>();
  const { params } = useRoute<DiaryByDateRoute>();
  const logId = params.logId;

  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const { mutateAsync: deleteLog, isPending: deleting } = useDeleteDailyLog(logId);
  const { showToast } = useToast();
  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      title: '감정기록',
      hasBack: true,
      hasButton: true,
      icon: 'IcVerticalDots',
      iconSize: 38,
      iconColor: 'white',
      onBack: () => {
        if (navigation.canGoBack()) navigation.goBack();
        navigation.replace('DiaryMain');
      },
      onPress: openMenu,
    });
  }, [navigation, openMenu]);
  const { data, isLoading, isError, refetch } = useDailyLogDetail(logId);

  const handleEdit = useCallback(() => {
    navigation.navigate('DiaryEdit', { logId });
  }, []);
  const handleDelete = async () => {
    try {
      await deleteLog(logId);
      setConfirmVisible(false);
      showToast('일기를 삭제했어요.', 'info');
      navigation.goBack();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ?? e?.message ?? '삭제에 실패했어요. 잠시 후 다시 시도해주세요.';
      console.error(msg);
    }
  };

  if (isLoading || deleting) return <Loader isPageLoader />;
  if (isError || !data)
    return (
      <View className="flex-1 items-center justify-center bg-bg p-7">
        <Text className="body1 pb-4 text-error">{`일기 정보를 불러오지 못했어요.`}</Text>
        <View className="overflow-hidden rounded-[20px]">
          <Pressable
            onPress={() => refetch()}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            className=" p-1"
          >
            <Text className="subHeading3 px-9 py-2 text-center text-error">⚠️ 다시 시도</Text>
          </Pressable>
        </View>
      </View>
    );

  const date = withKoreanDOW(data.logDate);
  const moodKey = emojiKeyFromNumber(data.mood);
  const moodUI = ACTIVE_UI[moodKey];
  const moodLabel = EMOJIS[moodKey];

  return (
    <>
      <ScrollView className="bg-bg">
        <View className="gap-5 px-7 pb-5 pt-10">
          <View className="items-center gap-10">
            <View className="items-center gap-6 px-11">
              <Text className="body2 text-gray-600">{date}</Text>
              <Text className="subHeading3 text-center text-white">
                {keepAllKorean(data.topic)}
              </Text>
            </View>
            <TextArea
              disabled
              value={data.content}
              minHeight={100}
              showCounter={false}
              containerClassName="!border-[#2D3342]"
            />
          </View>
          {data?.aiReflection ? (
            <View className="items-center gap-2.5 rounded-[20px] bg-bg-light px-11 py-5">
              {Platform.OS === 'ios' ? (
                <Image
                  source={require('@images/mini-star.png')}
                  style={{ height: 28, aspectRatio: 1, marginTop: -3 }}
                  resizeMode="contain"
                />
              ) : (
                <Icon name="IcStar" width={40} height={28} />
              )}
              <Text className="body1 text-center !leading-6 text-white">
                {keepAllKorean(data.aiReflection)}
              </Text>
            </View>
          ) : null}
          <View className="flex-row justify-center gap-3 rounded-[20px] border border-[#2D3342] px-6 py-[26px]">
            <Icon name={moodLabel.icon} size={32} color={moodUI.icon} />
            <View
              className={`gap-2 rounded-lg border p-2 ${moodKey === 'sad' ? 'border-white' : moodKey === 'bad' ? 'border-gray-200' : moodUI.border} ${moodKey === 'sad' ? 'bg-white' : moodKey === 'bad' ? `bg-[#808080]` : moodUI.bg}`}
            >
              <Text
                className={`body2 ${moodKey === 'sad' || moodKey === 'bad' ? 'text-gray-900' : 'text-white'}`}
              >
                {moodLabel.emotion}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <DropDownMenu
        visible={menuVisible}
        onDismiss={closeMenu}
        onEdit={handleEdit}
        onDelete={() => {
          setMenuVisible(false);
          setConfirmVisible(true);
        }}
      />
      <ConfirmDeleteModal
        visible={confirmVisible}
        helperText={`글을 삭제하면 되돌릴 수 없어요.\n지난 날짜의 일기는 다시 작성할 수 없으니 신중히 생각해주세요.`}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default DiaryByDateScreen;
