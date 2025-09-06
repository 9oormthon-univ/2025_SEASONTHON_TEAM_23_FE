/** 로컬 타임존 기준 한국식 날짜 포맷터 */
export const formatKoreanDate = (input?: string | Date | null): string => {
  if (!input) return '';

  // 문자열이면 'YYYY-MM-DD' 형태는 로컬로, 그 외(ISO 등)는 기본 파서 사용
  const toLocalDate = (v: string | Date): Date | null => {
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v;

    // 날짜-only (예: 2025-03-08) → 로컬 자정으로 해석
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      const [y, m, d] = v.split('-').map(Number);
      return new Date(y, (m ?? 1) - 1, d ?? 1);
    }

    // 그 외(예: 2025-03-08T12:34:56Z) → 기본 파서 (내부 UTC 보관, getHours는 로컬)
    const parsed = new Date(v);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const d = toLocalDate(typeof input === 'string' ? input : input);
  if (!d) return '';

  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 1-12
  const date = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();

  const mm = String(month).padStart(2, '0');
  const dd = String(date).padStart(2, '0');
  const HH = String(hours).padStart(2, '0');
  const MM = String(minutes).padStart(2, '0');

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[d.getDay()];

  // 예: 2025-03-08-토 09시 05분
  return `${year}-${mm}-${dd}-${weekday} ${HH}시 ${MM}분`;
};
