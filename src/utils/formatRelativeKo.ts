// 타임존이 없는 ISO(YYYY-MM-DDTHH:mm:ss[.fraction]) 문자열을 UTC로 간주하여 timestamp(ms)로 반환
const parseLooseUtc = (str: string): number | null => {
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.(\d+))?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, , frac] = m;
  const ms = (frac ?? '000').slice(0, 3).padEnd(3, '0');
  const date = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s), Number(ms));
  return date;
};

export const formatRelativeKo = (input: number | Date | string) => {
  let t: number;
  if (typeof input === 'number') {
    t = input;
  } else if (input instanceof Date) {
    t = input.getTime();
  } else {
    const str = String(input);
    // Z나 +오프셋이 있으면 기본 Date 파서 사용
    if (/Z|[+\-]\d{2}:?\d{2}$/.test(str)) {
      t = new Date(str).getTime();
    } else {
      t = parseLooseUtc(str) ?? new Date(str).getTime();
    }
  }
  if (isNaN(t)) return '';
  const diff = Math.max(0, Date.now() - t);
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
