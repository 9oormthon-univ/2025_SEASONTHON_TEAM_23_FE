import { api } from '@/services/axiosInstance';
import type { CreatePetDto, Pet } from '@/types/pets';

export async function fetchMyPets(): Promise<Pet[]> {
  const res = await api.get('/pets');
  return (res.data ?? res) as Pet[];
}

export const createPet = (body: CreatePetDto) => {
  return api.post('/pets', body);
};

export const activatePet = async (petId: number): Promise<string> => {
  const { data } = await api.patch(`/pets/${petId}/activate`);
  return data as string; // 스펙상 */* string
};

export const updatePet = async (petId: number, body: CreatePetDto): Promise<Pet> => {
  const { data } = await api.put(`/pets/update/${petId}`, body);
  return data as Pet;
};

export const deletePet = async (petId: number): Promise<void> => {
  await api.delete(`/pets/delete/${petId}`);
};
