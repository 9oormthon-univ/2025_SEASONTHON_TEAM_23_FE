import { View, Text } from 'react-native';
import type { DateData } from 'react-native-calendars';

type CustomDayProps = {
  date?: DateData;
  today: string;
};

const CustomDay = ({ date, today }: CustomDayProps) => {
  if (!date) return <View style={{ width: 24, height: 24 }} />;

  const dow = new Date(date.dateString).getDay();
  const isToday = date.dateString === today;
  const baseTextColor = dow === 0 ? '#B13E3E' : dow === 6 ? '#4492B9' : '#131313';

  return (
    <View
      style={{
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: isToday ? '#131313' : 'transparent',
      }}
    >
      <Text
        style={{
          fontFamily: 'Pretendard',
          fontSize: 16,
          fontWeight: '700',
          color: isToday ? 'white' : baseTextColor,
        }}
      >
        {date.day}
      </Text>
    </View>
  );
};

export default CustomDay;
