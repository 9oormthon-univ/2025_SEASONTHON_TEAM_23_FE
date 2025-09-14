import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';
import { getItemLayoutFactory, toRealIndex, withSentinels } from '@/utils/carousel';

type UseInfiniteCarouselOptions<T> = {
  items: T[];
  autoMs?: number; // 자동 슬라이드 간격
  enableAuto?: boolean; // 자동 슬라이드 on/off
  loop?: boolean; // 무한 루프 사용 여부
};

export const useInfiniteCarousel = <T>({
  items,
  autoMs = 3500,
  enableAuto = true,
  loop = true,
}: UseInfiniteCarouselOptions<T>) => {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<T>>(null);

  // 센티넬 포함 데이터
  const data = useMemo(() => (loop ? withSentinels(items) : items), [items, loop]);

  // FlatList 페이지(센티넬 포함 인덱스). 루프면 1이 첫 실데이터
  const [page, setPage] = useState(loop ? 1 : 0);
  const realIndex = loop ? toRealIndex(page, items.length) : page;

  // 처음 위치 세팅
  useEffect(() => {
    if (!loop) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: 1, animated: false });
    });
  }, [loop]);

  // 자동 슬라이드
  useEffect(() => {
    if (!enableAuto || !width || items.length <= 1) return;
    const id = setInterval(() => {
      listRef.current?.scrollToOffset({ offset: (page + 1) * width, animated: true });
    }, autoMs);
    return () => clearInterval(id);
  }, [enableAuto, width, page, autoMs, items.length]);

  // 스크롤 종료 시 페이지 보정(루프 점프)
  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);

    if (!loop) {
      setPage(idx);
      return;
    }
    if (idx === 0) {
      setPage(items.length);
      listRef.current?.scrollToIndex({ index: items.length, animated: false });
    } else if (idx === items.length + 1) {
      setPage(1);
      listRef.current?.scrollToIndex({ index: 1, animated: false });
    } else {
      setPage(idx);
    }
  };

  const getItemLayout = getItemLayoutFactory(width);

  // 외부에서 제어하고 싶을 때 쓸 헬퍼
  const scrollTo = (i: number) => {
    if (!loop) {
      listRef.current?.scrollToIndex({ index: i, animated: true });
      return;
    }
    // 실인덱스(i) -> 센티넬 포함 인덱스(i+1)
    listRef.current?.scrollToIndex({ index: i + 1, animated: true });
  };

  const scrollNext = () =>
    listRef.current?.scrollToOffset({ offset: (page + 1) * width, animated: true });

  return {
    listRef,
    width,
    data,
    page, // 센티넬 포함 페이지
    realIndex, // 점 표시용 실제 인덱스
    onMomentumEnd,
    getItemLayout,
    scrollTo,
    scrollNext,
  };
};
