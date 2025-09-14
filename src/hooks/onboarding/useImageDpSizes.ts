import { useMemo } from 'react';
import { Image } from 'react-native';

export type DpSize = { w: number; h: number };

/** require(...) 리소스 배열 → 각 이미지의 '원본 dp 크기'와 첫 장 기준 박스 크기 */
export function useImageDpSizes(images: number[]) {
  const sizes = useMemo<DpSize[]>(
    () =>
      images.map((id) => {
        const src = Image.resolveAssetSource(id);
        const scale = src.scale ?? 1;
        return { w: src.width / scale, h: src.height / scale };
      }),
    [images]
  );

  const boxW = sizes[0]?.w ?? 0;
  const boxH = sizes[0]?.h ?? 0;

  return { sizes, boxW, boxH };
}
