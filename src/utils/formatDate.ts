export function formatKoreanDate(input?: string | Date | null) {
  if (!input) return '';
  const d = typeof input === 'string' ? new Date(input) : new Date(input);
  if (Number.isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();

  return `${year}년 ${month}월 ${date}일 ${hours}시 ${minutes}분`;
}
