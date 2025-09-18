/** [last, ...items, first] 형태로 센티넬 추가 */
export const withSentinels = <T>(items: T[]): T[] =>
  items.length ? [items[items.length - 1], ...items, items[0]] : items;

/** 센티넬 기준 페이지(page) -> 실제 인덱스(점 표시용) */
export const toRealIndex = (page: number, length: number) =>
  (((page - 1 + length) % length) + length) % length;

/** FlatList getItemLayout 생성기 (폭 고정일 때 깜빡임 방지) */
export const getItemLayoutFactory = (width: number) => (_: unknown, index: number) => ({
  length: width,
  offset: width * index,
  index,
});
