import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import Tag from './Tag';
import type { PersonalityValue } from '@/types/select';

type Props = {
  options: { label: string; value: PersonalityValue }[];
  selected: string[];
  onChange: (next: string[]) => void;
  conflicts?: Partial<Record<PersonalityValue, PersonalityValue[]>>;
  onConflict?: (a: PersonalityValue, b: PersonalityValue) => void;
};

const PersonalityTagGroup = ({
  options,
  selected,
  onChange,
  conflicts = {},
  onConflict,
}: Props) => {
  const selectedSet = useMemo(() => new Set(selected.map(String)), [selected]);

  const toggle = (val: PersonalityValue) => {
    const on = selectedSet.has(val);
    if (on) {
      onChange(selected.filter((v) => String(v) !== val));
      return;
    }
    const hit = (conflicts[val] ?? []).find((c) => selectedSet.has(c));
    if (hit) {
      onConflict?.(val, hit);
      return;
    }
    onChange([...selected, val]);
  };

  return (
    <FlatList
      data={options}
      keyExtractor={(opt) => String(opt.value)}
      numColumns={3}
      scrollEnabled={false}
      columnWrapperStyle={{ gap: 16, justifyContent: 'center' }}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      renderItem={({ item }) => (
        <Tag
          label={item.label}
          active={selectedSet.has(item.value)}
          onPress={() => toggle(item.value)}
        />
      )}
    />
  );
};

export default PersonalityTagGroup;
