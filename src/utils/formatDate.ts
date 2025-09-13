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
