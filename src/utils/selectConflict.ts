// utils/selectConflict.ts
import { Alert } from 'react-native';
import { PERSONALITY_OPTIONS } from '@/types/select';
import type { SelectItem } from '@/types/select';

const toItem = (v: SelectItem | string): SelectItem => {
  if (typeof v !== 'string') return v;
  const found = PERSONALITY_OPTIONS.find((o) => o.value === v);
  return found ?? { label: v, value: v };
};

// 오버로드 시그니처(문자열 1개 혹은 배열 모두 허용)
export function showConflictAlert(
  picked: SelectItem | string,
  conflicted: Array<SelectItem | string>
): void;
export function showConflictAlert(
  picked: SelectItem | string,
  conflicted: SelectItem | string
): void;

export function showConflictAlert(
  picked: SelectItem | string,
  conflicted: Array<SelectItem | string> | SelectItem | string
) {
  const pickedItem = toItem(picked);
  const list = Array.isArray(conflicted) ? conflicted : [conflicted];
  const names = list
    .map(toItem)
    .map((i) => i.label)
    .join(', ');
  Alert.alert('선택할 수 없어요', `"${pickedItem.label}"은 "${names}"과 함께 선택할 수 없어요.`);
}
