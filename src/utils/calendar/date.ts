/** 'YYYY-MM-DD' (UTC 기준 ISO) */
export const toISODate = (d: Date) => {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const withKoreanDOW = (iso: string) => {
  const d = new Date(iso);
  const n = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${iso}-${n}`;
};

/** 오늘 ISO ('YYYY-MM-DD') */
export const todayISO = () => toISODate(new Date());

/** 'YYYY-MM-DD'를 로컬 Date로 안전하게 파싱 (ECMAScript는 이 포맷을 UTC로 취급하기 때문) */
export const parseISODateLocal = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

export const localISODate = (iso: string): string => {
  const d = parseISODateLocal(iso);
  return toISODate(d);
};

/** 입력(ISO or Date) → 그 달의 1일 ISO ('YYYY-MM-01') */
export const monthStartISO = (input: string | Date) => {
  const d = typeof input === 'string' ? new Date(input) : input;
  return toISODate(new Date(d.getFullYear(), d.getMonth(), 1));
};

/** 'YYYY-MM-01' 기준으로 달 이동 */
export const addMonthsISO = (monthISO: string, delta: number) => {
  const y = Number(monthISO.slice(0, 4));
  const m = Number(monthISO.slice(5, 7)) - 1;
  const next = new Date(y, m + delta, 1);
  return toISODate(new Date(next.getFullYear(), next.getMonth(), 1));
};

/** 'YYYY-MM-01' → 'M월' */
export const monthKo = (monthISO: string) => {
  const m = Number(monthISO.slice(5, 7)) - 1;
  return `${m + 1}월`;
};
