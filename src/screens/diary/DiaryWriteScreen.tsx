import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useRef, useState } from 'react';
import Icon from '@common/Icon';
import { ACTIVE_UI, type EmojiKey, EMOJIS } from '@/constants/diary/emoji';

const MAX = 500;

const DiaryWriteScreen = () => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiKey | null>(null);
  const inputRef = useRef<TextInput>(null);
  return (
    <ScrollView>
      <View className="gap-7 bg-gray-50 px-7 pb-[72px] pt-9">
        <View className="items-center gap-4">
          <View className="items-center gap-6">
            <Text className="body2 text-[#343434]">{`2025-09-01-월`}</Text>
            <Text className="subHeading3 text-gray-900">{`스스로에게 해주고 싶은 위로의 말은 무엇인가요?`}</Text>
          </View>
          <Pressable
            onPress={() => {
              inputRef.current?.focus();
            }}
            className={`${focused && 'border border-gray-800'} w-full
        justify-between rounded-[20px] bg-white p-5`}
          >
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={setValue}
              placeholder="텍스트를 입력해주세요."
              placeholderTextColor="#BABABA"
              multiline
              textAlignVertical="top"
              maxLength={MAX}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              underlineColorAndroid="transparent"
              className="body1 min-h-[274px] text-gray-900"
            />
            <Text className="captionSB self-end text-gray-400">
              {value.length} / 최대 {MAX}자
            </Text>
          </Pressable>
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
      </View>
    </ScrollView>
  );
};

export default DiaryWriteScreen;
