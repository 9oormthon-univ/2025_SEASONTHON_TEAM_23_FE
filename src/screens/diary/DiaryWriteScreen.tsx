import { View, Text, TextInput, Pressable, ScrollView, Switch } from 'react-native';
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
import Loader from '@common/Loader';
import { todayISO, withKoreanDOW } from '@/utils/calendar/date';

const MAX = 500;

type DiaryWriteRoute = RouteProp<DiaryStackParamList, 'DiaryWrite'>;

const DiaryWriteScreen = () => {
  const { params } = useRoute<DiaryWriteRoute>();
  const { topic } = params;
  const navigation = useNavigation<NativeStackNavigationProp<DiaryStackParamList, 'DiaryWrite'>>();
  const { user } = useAuth();
  const userId = Number(user?.userId);

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
      title: '오늘의 일기',
      hasBack: true,
      hasButton: true,
      onPress: submit,
    });
  }, [navigation, submit]);
  const inputRef = useRef<TextInput>(null);

  const today = withKoreanDOW(todayISO());

  return (
    <ScrollView>
      {isSubmitting && <Loader />}
      <View className="gap-7 bg-gray-50 px-7 pb-[72px] pt-10">
        <View className="items-center gap-4">
          <View className="items-center gap-6">
            <Text className="body2 text-[#343434]">{today}</Text>
            <Text className="subHeading3 text-center text-gray-900">{topic}</Text>
          </View>
          <TextArea ref={inputRef} value={value} onChangeText={setValue} maxLength={MAX} />
        </View>
        <View className="items-center gap-4">
          <Text className="subHeading3 text-gray-900">{`오늘 어떤 하루를 보내셨나요?`}</Text>
          <View className="w-full flex-row justify-center gap-3 rounded-[20px] bg-white px-3 py-5">
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
                  <Text className="captionSB mt-2 text-center text-gray-900">{labelKo}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View className="flex-row justify-between rounded-[20px] bg-white px-8 py-5">
          <View>
            <Text className="captionSB text-gray-900">{`이 글에 대한`}</Text>
            <Text className="body1 !leading-6 text-gray-900">{`공감문을 받을 수 있어요.`}</Text>
          </View>
          <Switch
            value={needAiReflection}
            onValueChange={setNeedAiReflection}
            trackColor={{ false: '#CECECE', true: '#7EB658' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default DiaryWriteScreen;
