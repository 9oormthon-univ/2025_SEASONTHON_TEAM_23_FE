import { api } from '@/services/axiosInstance';
import type { CreatePetDto } from '@/types/pets';

export type Pet = {
  id: number;
  name: string;
  breed: string;
  personality: string;
};

export async function fetchMyPets(): Promise<Pet[]> {
  const res = await api.get('/pets');
  return (res.data ?? res) as Pet[];
}

export const createPet = (body: CreatePetDto) => {
  return api.post('/pets', body);
};
