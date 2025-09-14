import { useRef } from 'react';
import { View, FlatList, Image } from 'react-native';
import { useImageDpSizes } from '@/hooks/onboarding/useImageDpSizes';
import { useAutoCarousel } from '@/hooks/onboarding/useAutoCarousel';

type Props = {
  images: number[];
  interval?: number;
  pauseAfterDragMs?: number;
};

const OnboardingCarousel = ({ images, interval = 3000, pauseAfterDragMs = 1200 }: Props) => {
  const listRef = useRef<FlatList<number>>(null);

  // 원본 dp 크기 기반 레이아웃
  const { sizes, boxW, boxH } = useImageDpSizes(images);

  // 자동 넘김 + 드래그 일시정지
  const { index, onMomentumScrollEnd, onScrollBeginDrag, onScrollEndDrag } = useAutoCarousel({
    itemWidth: boxW,
    count: images.length,
    listRef,
    interval,
    pauseAfterDragMs,
  });

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
