import { api } from './axiosInstance';

export type Letter = {
  letterId: number;
  title: string;
  content: string;
  authorId?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

export const fetchLetters = async (page = 0, size = 20) => {
  const { data } = await api.get('/letters/public', { params: { page, size } });
  return data;
};

export const fetchLetterById = async (letterId: number | string) => {
  const { data } = await api.get(`/letters/${letterId}`);
  return data;
};

export const createLetter = async (payload: { title: string; content: string; images?: string[] }) => {
  const { data } = await api.post('/letters', payload);
  return data;
};

export const updateLetter = async (letterId: number | string, payload: Partial<{ title: string; content: string; images?: string[] }>) => {
  const { data } = await api.put(`/letters/${letterId}`, payload);
  return data;
};

export const deleteLetter = async (letterId: number | string) => {
  const { data } = await api.delete(`/letters/${letterId}`);
  return data;
};

// 이미지 업로드 (React Native의 file 객체 형태를 가정)
export const uploadLetterImage = async (file: { uri: string; name?: string; type?: string }) => {
  const form = new FormData();
  form.append('file', {
    uri: file.uri,
    name: file.name ?? 'image.jpg',
    type: file.type ?? 'image/jpeg',
  } as any);
  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
