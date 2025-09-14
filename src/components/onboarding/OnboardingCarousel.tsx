// components/OnboardingCarousel.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

type Props = {
  images: number[]; // require(...) 배열
  interval?: number; // 자동 슬라이드 간격(ms)
  pauseAfterDragMs?: number; // 드래그 끝난 뒤 자동 재개까지 대기(ms)
};

const OnboardingCarousel = ({ images, interval = 3000, pauseAfterDragMs = 1200 }: Props) => {
  const listRef = useRef<FlatList<number>>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // 각 이미지의 "원본 dp 크기" (px / scale)
  const sizes = useMemo(
    () =>
      images.map((resId) => {
        const src = Image.resolveAssetSource(resId);
        const scale = src.scale ?? 1;
        return { w: src.width / scale, h: src.height / scale };
      }),
    [images]
  );

  // 슬라이드 박스 크기 = 첫 이미지 원본 크기 기준
  const boxW = sizes[0]?.w ?? 0;
  const boxH = sizes[0]?.h ?? 0;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  const startAuto = () => {
    if (!boxW || images.length <= 1) return;
    stopAuto();
    intervalRef.current = setInterval(() => {
      const next = (indexRef.current + 1) % images.length;
      listRef.current?.scrollToOffset({ offset: next * boxW, animated: true });
      setIndex(next);
    }, interval);
  };

  useEffect(() => {
    startAuto();
    return () => {
      stopAuto();
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, [boxW, images.length, interval]);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!boxW) return;
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / boxW);
    setIndex(newIndex);
  };

  const onScrollBeginDrag = () => {
    // 드래그 시작 → 자동 넘김 일시정지
    stopAuto();
    if (resumeRef.current) {
      clearTimeout(resumeRef.current);
      resumeRef.current = null;
    }
  };

  const onScrollEndDrag = () => {
    // 드래그 끝 → 잠깐 쉬고 자동 넘김 재개
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(startAuto, pauseAfterDragMs);
  };

  if (!boxW || !boxH) return null;

  return (
    <View style={{ width: boxW, gap: 8 }}>
      <FlatList
        ref={listRef}
        data={images}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        // 성능 옵션
        initialNumToRender={1}
        windowSize={2}
        removeClippedSubviews
        maxToRenderPerBatch={1}
        style={{ width: boxW, height: boxH }}
        contentContainerStyle={{ height: boxH }}
        renderItem={({ item, index: i }) => (
          <View
            style={{
              width: boxW,
              height: boxH,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* 이미지도 원본 dp 크기 그대로 */}
            <Image source={item} style={{ width: sizes[i].w, height: sizes[i].h }} />
          </View>
        )}
      />

      {/* 도트 */}
      <View className="flex-row justify-center gap-2">
        {images.map((_, i) => (
          <View
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i === index ? '#FFD86F' : '#9D9D9D',
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default OnboardingCarousel;
