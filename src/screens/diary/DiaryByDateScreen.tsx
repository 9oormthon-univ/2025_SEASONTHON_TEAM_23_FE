import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
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
  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      title: '오늘의 일기',
      hasBack: true,
      hasButton: true,
      icon: 'IcVerticalDots',
      iconSize: 38,
      iconColor: '#313131',
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
      Alert.alert('삭제 완료', '일기가 삭제되었습니다.');
      navigation.goBack();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ?? e?.message ?? '삭제에 실패했어요. 잠시 후 다시 시도해주세요.';
      Alert.alert('오류', msg);
    }
  };

  if (isLoading || deleting) return <Loader />;
  if (isError || !data)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-7">
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
      <ScrollView>
        <View className="gap-4 bg-gray-50 px-7 pb-[42px] pt-10">
          <View className="items-center gap-4">
            <View className="items-center gap-6">
              <Text className="body2 text-[#343434]">{date}</Text>
              <Text className="subHeading3 text-center text-gray-900">
                {keepAllKorean(data.topic)}
              </Text>
            </View>
            <TextArea disabled value={data.content} showCounter={false} onChangeText={() => {}} />
          </View>
          {data?.aiReflection ? (
            <View className="items-center gap-2.5 rounded-[20px] bg-[#C0E3A8] p-5">
              <Icon name="IcFlower" size={24} color="#7EB658" />
              <Text className="body1 text-center !leading-6 text-gray-900">
                {keepAllKorean(data.aiReflection)}
              </Text>
            </View>
          ) : null}
          <View className="flex-row justify-center gap-3 rounded-[20px] bg-white px-6 py-[26px]">
            <Icon name={moodLabel.icon} size={32} color={moodUI.icon} />
            <View className={`gap-2 rounded-lg border p-2 ${moodUI.border} ${moodUI.bg}`}>
              <Text className="body2 text-gray-900">{moodLabel.emotion}</Text>
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
