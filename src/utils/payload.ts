export type CreatePetPayload = {
  name: string;
  breed: string;
  personality: string; // CSV
};

export const toCSV = (arr: Array<string | number>): string => arr.map(String).join(',');

export const buildCreatePetPayload = ({
  name,
  species,
  personalities,
}: {
  name: string;
  species: string; // 종 1개
  personalities: Array<string | number>; // 다중 선택
}): CreatePetPayload => ({
  name: name.trim(),
  breed: species, // API 스펙: breed
  personality: toCSV(personalities),
});
