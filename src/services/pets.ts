import { api } from '@/services/axiosInstance';

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
