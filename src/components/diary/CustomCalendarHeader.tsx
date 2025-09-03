import { View, Text, Pressable } from 'react-native';
import { monthKo } from '@/utils/calendar/date';
import Icon from '@common/Icon';

type CalenderHeaderProps = {
  month: string;
  onPrev: () => void;
  onNext: () => void;
};

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

const CustomCalendarHeader = ({ month, onPrev, onNext }: CalenderHeaderProps) => {
  return (
    <View className="h-[84px] items-center justify-center gap-1 bg-white">
      <View className="w-[183px] flex-row items-center justify-between gap-9 px-3 py-2">
        <Pressable onPress={onPrev} accessibilityRole="button">
          <Icon name="IcBack" size={28} color="#9D9D9D" />
        </Pressable>
        <Text className="subHeading1B text-gray-700">{monthKo(month)}</Text>
        <Pressable onPress={onNext} accessibilityRole="button">
          <Icon name="IcNext" size={28} color="#9D9D9D" />
        </Pressable>
      </View>
      <View className="w-full flex-row justify-evenly gap-5 px-3 py-2">
        {DAY_NAMES.map((n, i) => (
          <Text
            key={n}
            className={`subHeading3 h-6 w-6 text-center ${i === 0 ? 'text-[#CD8383]' : i === 6 ? 'text-[#71ACC9]' : 'text-[#585858]'}`}
          >
            {n}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default CustomCalendarHeader;
