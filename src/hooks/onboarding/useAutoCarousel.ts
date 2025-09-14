import { useCallback, useEffect, useRef, useState } from 'react';
import type { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type Options = {
  itemWidth: number;
  count: number;
  listRef: React.RefObject<FlatList<any> | null>;
  interval?: number;
  pauseAfterDragMs?: number;
};

export function useAutoCarousel({
  itemWidth,
  count,
  listRef,
  interval = 3000,
  pauseAfterDragMs = 1200,
}: Options) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (!itemWidth || count <= 1) return;
    stop();
    intervalRef.current = setInterval(() => {
      const next = (indexRef.current + 1) % count;
      listRef.current?.scrollToOffset({ offset: next * itemWidth, animated: true });
      setIndex(next);
    }, interval);
  }, [count, interval, itemWidth, listRef, stop]);

  useEffect(() => {
    start();
    return () => {
      stop();
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, [start, stop]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!itemWidth) return;
      const newIndex = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
      setIndex(newIndex);
    },
    [itemWidth]
  );

  const onScrollBeginDrag = useCallback(() => {
    stop();
    if (resumeRef.current) {
      clearTimeout(resumeRef.current);
      resumeRef.current = null;
    }
  }, [stop]);

  const onScrollEndDrag = useCallback(() => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(start, pauseAfterDragMs);
  }, [pauseAfterDragMs, start]);

  return { index, setIndex, start, stop, onMomentumScrollEnd, onScrollBeginDrag, onScrollEndDrag };
}
