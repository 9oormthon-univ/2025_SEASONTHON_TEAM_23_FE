import { useCallback, useMemo, useState } from 'react';
import type { DateData } from 'react-native-calendars';
import { addMonthsISO, monthStartISO, todayISO } from '@/utils/calendar/date';
import { useDailyLogs } from '@/hooks/queries/useDailyLog';

type Params = {
  userId: string;
  onSelectDate: (isoDate: string) => void;
  initialMonthISO?: string;
};

export const useEmotionCalendar = ({ userId, onSelectDate, initialMonthISO }: Params) => {
  // 현재 표시 중인 달 (YYYY-MM-01)
  const [current, setCurrent] = useState<string>(initialMonthISO ?? monthStartISO(new Date()));

  // 서버에서 가져온 일기들의 감정색상 매핑
  const { moodColorByDate } = useDailyLogs(userId);

  // 헤더에 넘길 레이블 (Header에서 monthKo(current)로 변환)
  const monthLabel = useMemo(() => current, [current]);

  // 오늘 ISO
  const today = todayISO();

  // 달 이동
  const goPrev = useCallback(() => {
    setCurrent((prev) => addMonthsISO(prev, -1));
  }, []);

  const goNext = useCallback(() => {
    setCurrent((prev) => addMonthsISO(prev, +1));
  }, []);

  // 캘린더 스와이프/넘김으로 달이 바뀔 때 동기화
  const onMonthChange = useCallback((m: DateData) => {
    setCurrent(monthStartISO(m.dateString));
  }, []);

  // 날짜 클릭 시 부모로 전달
  const onDayPress = useCallback(
    (d: DateData) => {
      onSelectDate(d.dateString);
    },
    [onSelectDate]
  );

  return {
    current,
    monthLabel,
    today,
    moodColorByDate,
    goPrev,
    goNext,
    onMonthChange,
    onDayPress,
  };
};
