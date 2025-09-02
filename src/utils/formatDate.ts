export function formatKoreanDate(input?: string | Date | null) {
  if (!input) return '';
  const d = typeof input === 'string' ? new Date(input) : new Date(input);
  if (Number.isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();

  // 10 미만에는 0 붙이기
  const mm = String(month).padStart(2, '0');
  const dd = String(date).padStart(2, '0');

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[d.getDay()];

  return `${year}-${mm}-${dd}-${weekday} ${hours}시 ${minutes}분`;
}
