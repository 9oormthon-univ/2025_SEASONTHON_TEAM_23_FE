import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, Text, View, Platform, ScrollView } from 'react-native';
import Icon from '@common/Icon';
import { toggleInArray } from '@/utils/array';
import type { SelectItem } from '@/types/select';

type Value = string | number;

type Props = {
  label?: string;
  items: SelectItem[];
  values: Value[];
  onChange: (next: Value[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMsg?: string;
  noScrollMaxCount?: number; // 이 개수 이하면 전체 노출 (기본 5)
  scrollVisibleRows?: number; // 초과 시 보이는 행수 (기본 3)
  closeOnSelect?: boolean; // 아이템 탭 시 즉시 닫기 (기본 false)
  maxSelected?: number; // 선택 개수 제한 (없으면 무제한)
  className?: string;
  triggerBgColor?: string;
  triggerTextColor?: string;
  triggerIconColor?: string;

  /** 서로 함께 선택되면 안 되는 조합 */
  conflicts?: Partial<Record<Value, Value[]>>;
  /** 충돌 시 동작: block = 선택을 막기, replace = 충돌값들 제거하고 새 값 선택 */
  conflictStrategy?: 'block' | 'replace';
  /** block일 때 UX 피드백 (토스트) */
  onConflict?: (picked: SelectItem, conflicted: SelectItem[]) => void;
};

const ITEM_H = 52;
const SEP_H = 1.2;

const SelectBox: React.FC<Props> = ({
  label,
  items,
  values,
  onChange,
  placeholder = '선택하세요',
  disabled,
  error,
  errorMsg,
  noScrollMaxCount = 5,
  scrollVisibleRows = 3,
  closeOnSelect = false,
  maxSelected,
  className,
  triggerBgColor = '#313131',
  triggerTextColor = '#FFFFFF',
  triggerIconColor,
  conflicts,
  conflictStrategy,
  onConflict,
}) => {
  const [open, setOpen] = useState(false);

  const selectedSet = useMemo(() => new Set(values), [values]);
  const selectedItems = useMemo(
    () => items.filter((i) => selectedSet.has(i.value)),
    [items, selectedSet]
  );

  // 트리거에 표시할 텍스트
  const displayText = useMemo(() => {
    if (selectedItems.length === 0) return placeholder;
    const labels = selectedItems.map((i) => i.label);
    if (labels.length <= 2) return labels.join(', ');
    return `${labels[0]}, ${labels[1]} 외 ${labels.length - 2}`;
  }, [placeholder, selectedItems]);

  // 노출 행 수 & 스크롤 여부 & 목표 높이
  const { scrollEnabled, targetHeight } = useMemo(() => {
    const count = items.length;
    const showAll = count <= noScrollMaxCount;
    const rows = showAll ? count : Math.max(1, scrollVisibleRows);
    const h = rows * ITEM_H + Math.max(0, rows - 1) * SEP_H;
    return { visibleRows: rows, scrollEnabled: !showAll, targetHeight: h };
  }, [items.length, noScrollMaxCount, scrollVisibleRows]);

  // 펼침/접힘 높이 애니메이션
  const heightAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: open ? targetHeight : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [open, targetHeight, heightAnim]);

  // 화살표 회전
  const rotate = heightAnim.interpolate({
    inputRange: [0, Math.max(1, targetHeight)],
    outputRange: ['0deg', '180deg'],
  });

  const handleToggle = (item: SelectItem) => {
    if (disabled) return;

    const isSingle = maxSelected === 1;
    const alreadySelected = selectedSet.has(item.value);

    if (isSingle) {
      if (alreadySelected) {
        setOpen(false);
        return;
      }
      onChange([item.value]);
      setOpen(false);
      return;
    }

    // 다중 선택
    const willSelect = !alreadySelected;
    if (willSelect && maxSelected != null && values.length >= maxSelected) {
      return; // 제한 초과
    }

    // 충돌 체크
    const conflictMap = conflicts ?? {};
    const conflictList = willSelect ? (conflictMap[item.value] ?? []) : [];
    const conflictedSelectedValues = conflictList.filter((v) => selectedSet.has(v));

    if (willSelect && conflictedSelectedValues.length > 0) {
      if (conflictStrategy === 'block' || !conflictStrategy) {
        onConflict?.(
          item,
          items.filter((i) => conflictedSelectedValues.includes(i.value))
        );
        return;
      }

      // replace
      const next = values.filter((v) => !conflictedSelectedValues.includes(v));
      next.push(item.value);
      onChange(next);
      if (closeOnSelect) setOpen(false);
      return;
    }

    const next = toggleInArray(values, item.value);
    onChange(next);
    if (closeOnSelect) setOpen(false);
  };

  const renderRow = (item: SelectItem) => {
    const selected = selectedSet.has(item.value);
    return (
      <Pressable
        key={`${typeof item.value === 'string' ? item.value : String(item.value)}`}
        onPress={() => handleToggle(item)}
        android_ripple={{ color: 'rgba(255,255,255,0.06)' }}
        className="flex-row items-center justify-between bg-gray-700 px-5 py-4"
        style={{ height: ITEM_H }}
      >
        <Text className={`body1 ${selected ? 'text-white' : 'text-gray-50'}`}>{item.label}</Text>
        {selected && <Text className="text-white">✓</Text>}
      </Pressable>
    );
  };

  return (
    <View className={`w-full gap-2 ${className ?? ''}`}>
      {!!label && <Text className="body2 text-gray-200">{label}</Text>}

      {/* 트리거 + 드롭다운을 한 박스로 */}
      <View className={`overflow-hidden rounded-2xl ${error && 'border border-error'}`}>
        {/* 트리거 */}
        <Pressable
          onPress={() => !disabled && setOpen((v) => !v)}
          disabled={disabled || error}
          className={`w-full flex-row items-center justify-between px-5 py-4 ${disabled ? 'opacity-60' : ''}`}
          style={{ backgroundColor: triggerBgColor }}
        >
          <Text
            className="body1"
            style={{
              color: error
                ? '#FF2E45'
                : disabled || !selectedItems.length
                  ? '#808080'
                  : triggerTextColor,
            }}
          >
            {error ? errorMsg : displayText}
          </Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Icon
              name="IcChevronUp"
              size={18}
              color={
                error
                  ? '#FF2E45'
                  : disabled || !selectedItems.length
                    ? '#808080'
                    : (triggerIconColor ?? triggerTextColor)
              }
            />
          </Animated.View>
        </Pressable>

        {/* 드롭다운 영역: ScrollView로 전환 */}
        <Animated.View style={{ height: heightAnim }}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            scrollEnabled={scrollEnabled}
            style={{ height: targetHeight }}
            nestedScrollEnabled
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
          >
            {items.map((it, idx) => (
              <View key={`${typeof it.value === 'string' ? it.value : String(it.value)}-${idx}`}>
                {renderRow(it)}
                {idx < items.length - 1 && (
                  <View style={{ height: SEP_H }} className="bg-gray-800" />
                )}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>

      {Platform.OS === 'ios' && <View style={{ height: 2 }} />}
    </View>
  );
};

export default SelectBox;
