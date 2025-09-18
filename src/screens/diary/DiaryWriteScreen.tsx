import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useLayoutEffect, useRef, useState } from 'react';
import Icon from '@common/Icon';
import { ACTIVE_UI, type EmojiKey, EMOJIS } from '@/constants/diary/emoji';
import TextArea from '@common/TextArea';
import { useAuth } from '@/provider/AuthProvider';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDiarySubmit } from '@/hooks/diary/useDiarySubmit';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DiaryStackParamList } from '@/types/navigation';
import { setHeaderExtras } from '@/types/Header';
import { localISODate, todayISO, withKoreanDOW } from '@/utils/calendar/date';
import { usePetSelect } from '@/hooks/diary/usePetSelect';
import Loader from '@common/Loader';
import SelectBox from '@common/SelectBox';
import ToggleCard from '@common/ToggleCard';

const MAX = 500;

type DiaryWriteRoute = RouteProp<DiaryStackParamList, 'DiaryWrite'>;

const DiaryWriteScreen = () => {
  const { params } = useRoute<DiaryWriteRoute>();
  const { topic } = params;
  const navigation = useNavigation<NativeStackNavigationProp<DiaryStackParamList, 'DiaryWrite'>>();
  const { user } = useAuth();
  const userId = Number(user?.userId);
  const { items, values, onChange, loading, isError } = usePetSelect({ enabled: true });

  const [value, setValue] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiKey | null>(null);
  const [needAiReflection, setNeedAiReflection] = useState<boolean>(true);

  const { submit, isSubmitting } = useDiarySubmit({
    userId,
    selectedEmoji,
    content: value,
    needAiReflection,
    onSuccess: (logId) => navigation.replace('DiaryByDate', { logId }),
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
        navigation.replace('DiaryMain');
      },
    });
  }, [navigation, submit]);
  const inputRef = useRef<TextInput>(null);

  const today = withKoreanDOW(localISODate(todayISO()));

  return (
    <ScrollView className="bg-bg pt-10">
      {loading && <Loader />}
      <View className="gap-5 px-7 pb-[72px]">
        <View className="items-center gap-4">
          <View className="items-center gap-6 px-11">
            <Text className="body2 text-gray-600">{today}</Text>
            <Text className="subHeading3 text-center text-white">{topic}</Text>
          </View>
          <TextArea ref={inputRef} value={value} onChangeText={setValue} maxLength={MAX} />
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
                  className={`${selected ? `border ${ui.border} ${ui.bg}` : 'border-0 bg-emoji-off'} w-[47px] items-center justify-center rounded-lg px-1 py-2
                    `}
                >
                  <Icon name={icon as any} size={27} color={ui.icon} />
                  <Text className="captionSB mt-2 text-center text-white">{labelKo}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View className="gap-3">
          <ToggleCard
            value={needAiReflection}
            onChange={setNeedAiReflection}
            smallText="이 글에 대한"
            mainText="공감문을 받을 수 있어요"
          />
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

export default DiaryWriteScreen;
