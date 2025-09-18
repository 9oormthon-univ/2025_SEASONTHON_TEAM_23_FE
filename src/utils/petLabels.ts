import { PERSONALITY_OPTIONS, SPECIES_OPTIONS } from '@/types/select';

export const buildLabelMap = <T extends string | number>(arr: { label: string; value: T }[]) => {
  const m: Record<string, string> = {};
  arr.forEach((o) => (m[String(o.value)] = o.label));
  return m;
};

export const SPECIES_LABEL_MAP = buildLabelMap(SPECIES_OPTIONS);
export const PERSONALITY_LABEL_MAP = buildLabelMap(PERSONALITY_OPTIONS);

export const toKoreanSpecies = (value?: string | number | null) =>
  value != null ? (SPECIES_LABEL_MAP[String(value)] ?? String(value)) : '';

export const toKoreanPersonalities = (csv?: string | null) => {
  if (!csv) return '';
  return csv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((v) => PERSONALITY_LABEL_MAP[v] ?? v)
    .join(', ');
};
