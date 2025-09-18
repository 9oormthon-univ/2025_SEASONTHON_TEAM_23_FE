import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_PET_KEY = '@activePetId';

export const getActivePetId = async (): Promise<number | null> => {
  const raw = await AsyncStorage.getItem(ACTIVE_PET_KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

export const setActivePetId = async (id: number | null): Promise<void> => {
  if (id == null) {
    await AsyncStorage.removeItem(ACTIVE_PET_KEY);
    return;
  }
  await AsyncStorage.setItem(ACTIVE_PET_KEY, String(id));
};
