import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomCalendarHeader from '@diary/CustomCalendarHeader';
import CustomDay from '@diary/CustomDay';
import { useEmotionCalendar } from '@/hooks/diary/useEmotionCalendar';

type EmotionCalendarProps = {
  userId: number;
  onSelectDate: (isoDate: string) => void;
  initialMonthISO?: string;
};

const EmotionCalendar = ({ userId, onSelectDate, initialMonthISO }: EmotionCalendarProps) => {
  const {
    current,
    monthLabel,
    today,
    moodColorByDate,
    byDate,
    goPrev,
    goNext,
    onMonthChange,
    onDayPress,
  } = useEmotionCalendar({ userId, onSelectDate, initialMonthISO });

  const calKey = `cal-${current.slice(0, 7)}`;

  return (
    <View className="bg-white p-7">
      <CustomCalendarHeader month={monthLabel} onPrev={goPrev} onNext={goNext} />
      <Calendar
        key={calKey}
        current={current}
        onMonthChange={onMonthChange}
        hideArrows
        hideDayNames
        hideExtraDays
        renderHeader={() => null}
        onDayPress={onDayPress}
        dayComponent={({ date }) => {
          const iso = date?.dateString ?? '';
          const isToday = iso === today;
          const hasLog = !!byDate[iso];
          const disabled = !hasLog && !isToday;

          return (
            <CustomDay
              date={date}
              isToday={isToday}
              moodColor={moodColorByDate[iso]}
              disabled={disabled}
              onPress={(selectedISO) => {
                if (!disabled) onSelectDate(selectedISO);
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default EmotionCalendar;
