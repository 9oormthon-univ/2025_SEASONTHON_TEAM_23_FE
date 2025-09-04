import { api } from './axiosInstance';

export type Letter = {
  id: number;
  userId: number;
  content: string;
  createdAt?: string;
  [key: string]: any;
};

export const fetchLetters = async (page = 0, size = 20) => {
  const { data } = await api.get('/letters/public', { params: { page, size } });
  return data;
};

export const fetchMyLetters = async (page = 0, size = 20) => {
  const { data } = await api.get('/letters/me', { params: { page, size } });
  return data;
};

// GET /letters/{letterId} — swagger spec
export const fetchLetterById = async (letterId: number | string) => {
  const { data } = await api.get(`/letters/${letterId}`);
  return data;
};

// POST /letters — swagger spec
export const createLetter = async (payload: { title: string; content: string; images?: string[] }) => {
  const { data } = await api.post('/letters', payload);
  return data;
};

// PUT /letters/{letterId} — swagger spec
export const updateLetter = async (letterId: number | string, payload: Partial<{ title: string; content: string; images?: string[] }>) => {
  const { data } = await api.put(`/letters/${letterId}`, payload);
  return data;
};

// DELETE /letters/{letterId} — swagger spec
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

// GET /letters/{letterId}/tributes — swagger spec
export const fetchTributes = async (
  letterId: string | number,
  params?: Record<string, any>
) => {
  const { data } = await api.get(`/letters/${letterId}/tributes`, { params });
  return data;
};

// POST /letters/{letterId}/tributes — swagger spec
export const createTribute = async (letterId: string | number) => {
  // Backend no longer accepts a body; send an empty POST
  const { data } = await api.post(`/letters/${letterId}/tributes`);
  return data;
};

export const deleteTributeById = async (tributeId: string | number) => {
  const { data } = await api.delete(`/tributes/${tributeId}`);
  return data;
};


// GET /tributes/notifications/recent — swagger spec
export const fetchRecentTributeNotifications = async () => {
  const { data } = await api.get('/tributes/notifications/recent');
  return data;
};

// GET /tributes/messages — swagger spec
export const fetchTributeMessages = async (params?: Record<string, any>) => {
  const { data } = await api.get('/tributes/messages', { params });
  return data;
};
