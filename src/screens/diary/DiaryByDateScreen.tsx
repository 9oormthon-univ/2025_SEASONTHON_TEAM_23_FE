import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { useRef, useState } from 'react';
import { ACTIVE_UI, EMOJIS } from '@/constants/diary/emoji';
import { diaries } from '@/mocks/db.json';
import Icon from '@common/Icon';
import TextArea from '@common/TextArea';

const MAX = 500;

const DiaryByDateScreen = () => {
  const initialValue = diaries[0].content;
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<TextInput>(null);
  return (
    <ScrollView>
      <View className="items-center gap-11 bg-gray-50 px-7 pb-[42px] pt-9">
        <View className="w-full gap-7">
          <View className="items-center gap-4">
            <View className="items-center gap-6">
              <Text className="body2 text-[#343434]">{`2025-09-01-월`}</Text>
              <Text className="subHeading3 text-gray-900">{`스스로에게 해주고 싶은 위로의 말은 무엇인가요?`}</Text>
            </View>
            <TextArea
              disabled
              ref={inputRef}
              value={value}
              onChangeText={setValue}
              maxLength={MAX}
              showCounter={false}
            />
          </View>
          <View className="flex-row justify-center gap-3 rounded-[20px] bg-white px-6 py-[26px]">
            <Icon name={EMOJIS.best.icon} size={32} color={ACTIVE_UI.best.icon} />
            <View
              className={`gap-2 rounded-lg border p-2 ${ACTIVE_UI.best.border} ${ACTIVE_UI.best.bg}`}
            >
              <Text className="body2 text-gray-900">{EMOJIS.best.emotion}</Text>
            </View>
          </View>
        </View>
        <Pressable className="h-[46px] w-[154px] items-center justify-center rounded-xl bg-primary px-9 py-3">
          <Text className="body1 leading-6 text-white">{`수정하기`}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default DiaryByDateScreen;
