import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomCalendarHeader from '@diary/CustomCalendarHeader';
import CustomDay from '@diary/CustomDay';

const EmotionCalendar = () => {
  return (
    <View className="bg-white p-7">
      <CustomCalendarHeader month="9" />
      <Calendar
        hideArrows
        hideDayNames
        hideExtraDays
        renderHeader={() => null}
        dayComponent={({ date }) => <CustomDay date={date} today="2025-09-01" />}
      />
    </View>
  );
};

export default EmotionCalendar;
