import { View, Pressable, Text } from 'react-native';
import type { DateData } from 'react-native-calendars';

type CustomDayProps = {
  date?: DateData;
  isToday?: boolean;
  moodColor?: string;
  disabled?: boolean;
  onPress?: (isoDate: string) => void;
};

const CustomDay = ({ date, isToday, moodColor, disabled, onPress }: CustomDayProps) => {
  if (!date) return <View style={{ width: 24, height: 24 }} />;

  const dow = new Date(date.dateString).getDay();
  const bg = isToday ? '#131313' : (moodColor ?? 'transparent');
  const textColor = isToday ? 'white' : dow === 0 ? '#B13E3E' : dow === 6 ? '#4492B9' : '#131313';

  const handlePress = () => {
    if (!disabled && onPress) onPress(date.dateString);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      style={{
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: bg,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        style={{
          fontFamily: 'Pretendard',
          fontSize: 16,
          fontWeight: '700',
          color: textColor,
        }}
      >
        {date.day}
      </Text>
    </Pressable>
  );
};

export default CustomDay;
