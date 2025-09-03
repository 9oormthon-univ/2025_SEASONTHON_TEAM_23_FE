import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomCalendarHeader from '@diary/CustomCalendarHeader';
import CustomDay from '@diary/CustomDay';
import { useEmotionCalendar } from '@/hooks/diary/useEmotionCalendar';

type EmotionCalendarProps = {
  userId: string;
  onSelectDate: (isoDate: string) => void;
  initialMonthISO?: string;
};

const EmotionCalendar = ({ userId, onSelectDate, initialMonthISO }: EmotionCalendarProps) => {
  const { current, monthLabel, today, moodColorByDate, goPrev, goNext, onMonthChange, onDayPress } =
    useEmotionCalendar({ userId, onSelectDate, initialMonthISO });

  return (
    <View className="bg-white p-7">
      <CustomCalendarHeader month={monthLabel} onPrev={goPrev} onNext={goNext} />
      <Calendar
        current={current}
        onMonthChange={onMonthChange}
        hideArrows
        hideDayNames
        hideExtraDays
        renderHeader={() => null}
        onDayPress={onDayPress}
        dayComponent={({ date }) => {
          const iso = date?.dateString ?? '';
          return (
            <CustomDay
              date={date}
              isToday={iso === today}
              moodColor={moodColorByDate[iso]}
              onPress={(selectedISO) => {
                onSelectDate(selectedISO);
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default EmotionCalendar;
