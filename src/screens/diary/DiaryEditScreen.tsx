import { View, Text, Pressable, ScrollView } from 'react-native';
import { useLayoutEffect, useMemo, useState } from 'react';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DiaryStackParamList } from '@/types/navigation';
import { useAuth } from '@/provider/AuthProvider';
import { useDailyLogDetail } from '@/hooks/queries/useDailyLogDetail';
import { setHeaderExtras } from '@/types/Header';
import TextArea from '@common/TextArea';
import Icon from '@common/Icon';
import Loader from '@common/Loader';
import { EMOJIS, ACTIVE_UI, type EmojiKey } from '@/constants/diary/emoji';
import { emojiKeyFromNumber } from '@/utils/calendar/mood';
import { withKoreanDOW } from '@/utils/calendar/date';
import { useDiaryUpdate } from '@/hooks/diary/useDiaryUpdate';
import { keepAllKorean } from '@/utils/keepAll';
import CustomSwitch from '@common/CustomSwitch';
import SelectBox from '@common/SelectBox';
import { usePetSelect } from '@/hooks/diary/usePetSelect';

type EditRoute = RouteProp<DiaryStackParamList, 'DiaryEdit'>;

const MAX = 500;

const DiaryEditScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DiaryStackParamList>>();
  const { params } = useRoute<EditRoute>();
  const logId = params.logId;

  const { user } = useAuth();
  const userId = Number(user?.userId);

  const {
    items,
    values,
    onChange,
    loading: petLoading,
    isError: isPetError,
  } = usePetSelect({ enabled: true });

  const { data, isLoading, isError, refetch } = useDailyLogDetail(logId);

  const initialEmoji: EmojiKey | null = useMemo(
    () => (data ? emojiKeyFromNumber(data.mood) : null),
    [data]
  );

  const [value, setValue] = useState<string>(data?.content ?? '');
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiKey | null>(initialEmoji);
  const [needAiReflection, setNeedAiReflection] = useState<boolean>(true);

  useLayoutEffect(() => {
    if (data) {
      setValue(data.content ?? '');
      setSelectedEmoji(emojiKeyFromNumber(data.mood));
    }
  }, [data]);

  const { submit, isSubmitting } = useDiaryUpdate({
    userId,
    logId,
    selectedEmoji,
    content: value,
    needAiReflection,
    onSuccess: () => navigation.replace('DiaryByDate', { logId }),
  });

  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      title: '감정기록',
      hasBack: true,
      hasButton: true,
      onPress: submit,
      isLoading: isSubmitting,
      disabled: !value.trim(),
      onBack: () => {
        if (navigation.canGoBack()) navigation.goBack();
        navigation.replace('DiaryByDate', { logId });
      },
    });
  }, [navigation, submit]);

  if (isLoading || petLoading) return <Loader isPageLoader />;
  if (isError || !data || isPetError)
    return (
      <View className="flex-1 items-center justify-center bg-bg p-7">
        <Text className="body1 pb-4 text-error">{`일기 정보를 불러오지 못했어요.`}</Text>
        <View className="overflow-hidden rounded-[20px]">
          <Pressable
            onPress={() => refetch()}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            className="p-1"
          >
            <Text className="subHeading3 px-9 py-2 text-center text-error">{`⚠️ 다시 시도`}</Text>
          </Pressable>
        </View>
      </View>
    );

  const dateLabel = withKoreanDOW(data.logDate);

  return (
    <ScrollView className="bg-bg pt-10">
      <View className="gap-5 px-7 pb-[72px]">
        <View className="items-center gap-4">
          <View className="items-center gap-6 px-11">
            <Text className="body2 text-gray-600">{dateLabel}</Text>
            <Text className="subHeading3 text-center text-white">{keepAllKorean(data.topic)}</Text>
          </View>
          <TextArea value={value} onChangeText={setValue} maxLength={MAX} />
        </View>
        <View className="items-center gap-4">
          <Text className="subHeading3 text-white">{`오늘 어떤 하루를 보내셨나요?`}</Text>
          <View className="w-full flex-row justify-center gap-3 rounded-[20px] border-2 border-bg-light px-3 py-5">
            {(Object.keys(EMOJIS) as EmojiKey[]).map((key) => {
              const { icon, labelKo } = EMOJIS[key];
              const selected = selectedEmoji === key;
              const ui = ACTIVE_UI[key];

              return (
                <Pressable
                  key={key}
                  onPress={() => setSelectedEmoji(key)}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: false }}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  className={`${
                    selected ? `border ${ui.border} ${ui.bg}` : 'border-0 bg-emoji-off'
                  } w-[47px] items-center justify-center rounded-lg px-1 py-2`}
                >
                  <Icon name={icon as any} size={27} color={ui.icon} />
                  <Text className="captionSB mt-2 text-center text-white">{labelKo}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View className="gap-3">
          <View className="flex-row justify-between rounded-[20px] bg-bg-light px-8 py-5">
            <View>
              <Text className="captionSB text-white">{`이 글에 대한`}</Text>
              <Text className="body1 !leading-6 text-white">{`공감문을 받을 수 있어요.`}</Text>
            </View>
            <CustomSwitch value={needAiReflection} onValueChange={setNeedAiReflection} />
          </View>
          <Text className="captionSB text-center text-gray-500">{`어떤 반려동물의 공감문을 받으시나요?`}</Text>
          <SelectBox
            items={items}
            values={values}
            onChange={onChange}
            disabled={!needAiReflection}
            error={isError}
            errorMsg={
              isError ? '반려동물 목록을 불러오지 못했습니다. 다시 시도해주세요.' : undefined
            }
            closeOnSelect
            maxSelected={1}
            triggerBgColor="#2F394E"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default DiaryEditScreen;
