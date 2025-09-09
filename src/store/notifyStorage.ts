import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE = 'NOTIFY_ITEMS_V1';
const keyOf = (userId: string | number) => `${BASE}::${String(userId)}`;

export type StoredStarItem = {
  id: string; // 고유 키 (serverIso + count 기반 권장)
  count: number; // 이번 interval 동안 받은 수
  receivedAtIso: string; // 서버 기준 ISO
};

export async function loadNotifyItems(userId: string | number): Promise<StoredStarItem[]> {
  try {
    const raw = await AsyncStorage.getItem(keyOf(userId));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function saveNotifyItems(
  userId: string | number,
  items: StoredStarItem[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(keyOf(userId), JSON.stringify(items));
  } catch {}
}

/** 로그아웃 등에서 전체 삭제를 막고 싶으면 이 함수는 쓰지 마세요 */
// export async function clearNotifyItems(userId: string | number) {
//   try {
//     await AsyncStorage.removeItem(keyOf(userId));
//   } catch {}
// }
