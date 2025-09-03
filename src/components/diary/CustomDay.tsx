import { View, Pressable, Text } from 'react-native';
import type { DateData } from 'react-native-calendars';

type CustomDayProps = {
  date?: DateData;
  isToday?: boolean;
  moodColor?: string;
  onPress?: (isoDate: string) => void;
};

const CustomDay = ({ date, isToday, moodColor, onPress }: CustomDayProps) => {
  if (!date) return <View style={{ width: 24, height: 24 }} />;

  const bg = isToday ? '#131313' : (moodColor ?? 'transparent');
  const textColor = isToday ? 'white' : '#131313';

  const handlePress = () => {
    if (onPress) onPress(date.dateString);
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
