import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  Text,
  View,
  type ListRenderItemInfo,
  Platform,
} from 'react-native';
import Icon from '@common/Icon';
import { toggleInArray } from '@/utils/array';

type Value = string | number;
type Item = { label: string; value: Value };

type Props = {
  label?: string;
  items: Item[];
  values: Value[];
  onChange: (next: Value[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  noScrollMaxCount?: number; // 이 개수 이하면 전체 노출 (기본 5)
  scrollVisibleRows?: number; // 초과 시 보이는 행수 (기본 3)
  closeOnSelect?: boolean; // 아이템 탭 시 즉시 닫기 (기본 false)
  maxSelected?: number; // 선택 개수 제한 (없으면 무제한)
  className?: string;
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
  noScrollMaxCount = 5,
  scrollVisibleRows = 3,
  closeOnSelect = false,
  maxSelected,
  className,
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
    // 기본: 2개까지는 그대로, 3개 이상이면 "라벨1, 라벨2 외 N"
    const labels = selectedItems.map((i) => i.label);
    if (labels.length <= 2) return labels.join(', ');
    return `${labels[0]}, ${labels[1]} 외 ${labels.length - 2}`;
  }, [placeholder, selectedItems]);

  // 노출 행 수 & 스크롤 여부 & 목표 높이
  const { visibleRows, scrollEnabled, targetHeight } = useMemo(() => {
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

  // 화살표 회전(0deg ↔ 180deg)
  const rotate = heightAnim.interpolate({
    inputRange: [0, Math.max(1, targetHeight)],
    outputRange: ['0deg', '180deg'],
  });

  const handleToggle = (item: Item) => {
    if (disabled) return;

    const isSingle = maxSelected === 1;
    const alreadySelected = selectedSet.has(item.value);

    if (isSingle) {
      if (alreadySelected) {
        setOpen(false);
        return;
      }
      // 다른 값을 누르면 기존 값 대체
      onChange([item.value]);
      setOpen(false);
      return;
    }

    // 다중 선택 모드
    const willSelect = !alreadySelected;
    if (willSelect && maxSelected != null && values.length >= maxSelected) {
      return; // 제한 초과 시 무시
    }
    const next = toggleInArray(values, item.value);
    onChange(next);
    if (closeOnSelect) setOpen(false);
  };

  const renderItem = ({ item }: ListRenderItemInfo<Item>) => {
    const selected = selectedSet.has(item.value);
    return (
      <Pressable
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
      <View className="overflow-hidden rounded-2xl bg-gray-800">
        {/* 트리거 */}
        <Pressable
          onPress={() => !disabled && setOpen((v) => !v)}
          disabled={disabled}
          className={`w-full flex-row items-center justify-between bg-gray-800 px-5 py-4 ${
            error && 'border border-error'
          } ${disabled ? 'opacity-60' : ''}`}
        >
          <Text className={`body1 ${selectedItems.length ? 'text-white' : 'text-gray-600'}`}>
            {displayText}
          </Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Icon name="IcChevronUp" size={18} color="#6F717C" />
          </Animated.View>
        </Pressable>

        {/* 드롭다운 영역 */}
        <Animated.View style={{ height: heightAnim }}>
          <FlatList
            data={items}
            keyExtractor={(it, idx) =>
              `${typeof it.value === 'string' ? it.value : String(it.value)}-${idx}`
            }
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <View style={{ height: SEP_H }} className="bg-gray-800" />
            )}
            scrollEnabled={scrollEnabled}
            style={{ height: targetHeight }}
            keyboardShouldPersistTaps="handled"
            // 성능
            initialNumToRender={Math.max(visibleRows, 6)}
            maxToRenderPerBatch={Math.max(visibleRows, 6)}
            windowSize={5}
            removeClippedSubviews
            getItemLayout={(_, index) => ({
              length: ITEM_H + SEP_H,
              offset: (ITEM_H + SEP_H) * index,
              index,
            })}
            nestedScrollEnabled
          />
        </Animated.View>
      </View>

      {Platform.OS === 'ios' && <View style={{ height: 2 }} />}
    </View>
  );
};

export default SelectBox;
