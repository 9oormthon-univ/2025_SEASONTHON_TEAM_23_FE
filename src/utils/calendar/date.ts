/** 'YYYY-MM-DD' (UTC 기준 ISO) */
export const toISODate = (d: Date) =>
  new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);

/** 오늘 ISO ('YYYY-MM-DD') */
export const todayISO = () => toISODate(new Date());

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
