export const formatKoreanDate = (input?: string | Date | null): string => {
  if (!input) return '';
  const d =
    input instanceof Date
      ? input
      : /^\d{4}-\d{2}-\d{2}$/.test(input)
        ? new Date(input + 'T00:00:00')
        : new Date(input);

  try {
    const fmt = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const p = Object.fromEntries(fmt.formatToParts(d).map((x) => [x.type, x.value]));
    const w = (p.weekday || '').replace('요일', '');
    return `${p.year}-${p.month}-${p.day}-${w} ${p.hour}시 ${p.minute}분`;
  } catch {
    // Intl 없으면 수동으로 KST(+9h)
    const kst = new Date(d.getTime() + (9 * 60 + d.getTimezoneOffset()) * 60000);
    const y = kst.getFullYear();
    const m = String(kst.getMonth() + 1).padStart(2, '0');
    const day = String(kst.getDate()).padStart(2, '0');
    const w = ['일', '월', '화', '수', '목', '금', '토'][kst.getDay()];
    const hh = String(kst.getHours()).padStart(2, '0');
    const mm = String(kst.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}-${w} ${hh}시 ${mm}분`;
  }
};

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
