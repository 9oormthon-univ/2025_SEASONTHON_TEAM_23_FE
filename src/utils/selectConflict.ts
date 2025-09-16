import { Alert } from 'react-native';
import type { SelectItem } from '@/types/select';

export const showConflictAlert = (picked: SelectItem, conflicted: SelectItem[]) => {
  const names = conflicted.map((c) => c.label).join(', ');
  Alert.alert('선택할 수 없어요', `"${picked.label}"은 "${names}"과 함께 선택할 수 없어요.`);
};
