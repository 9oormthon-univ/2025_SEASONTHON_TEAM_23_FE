export const formatRelativeKo = (input: number | Date | string) => {
  const t =
    typeof input === 'number'
      ? input
      : typeof input === 'string'
        ? new Date(input).getTime()
        : input.getTime();
  const diff = Math.max(0, Date.now() - t); // ms
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return '방금 전';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}일 전`;
  const week = Math.floor(day / 7);
  return `${week}주 전`;
};
