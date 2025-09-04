import { api } from './axiosInstance';
import { tokenStore } from './auth/tokenStore';

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

// 헌화(tributes) 관련 API 헬퍼들
// fetchTributes can be called in two ways:
// - fetchTributes(letterId, params?) -> GET /letters/:letterId/tributes
// - fetchTributes(paramsObject) -> GET /tributes?{...params}
export const fetchTributes = async (
  letterIdOrParams?: string | number | Record<string, any>,
  maybeParams?: Record<string, any>
) => {
  if (letterIdOrParams && typeof letterIdOrParams === 'object') {
    const params = letterIdOrParams as Record<string, any>;
    const { data } = await api.get('/tributes', { params });
    return data;
  }

  const letterId = letterIdOrParams as string | number | undefined;
  const params = maybeParams ?? undefined;
  const { data } = await api.get(`/letters/${letterId}/tributes`, { params });
  return data;
};

// createTribute supports either:
// - createTribute({ letterId, fromUserId, messageKey?, createdAt? }) -> POST /tributes
// - createTribute(letterId, fromUserId, messageKey?, createdAt?) -> POST /letters/:letterId/tributes
export const createTribute = async (
  payloadOrLetterId: any,
  messageKey?: string,
) => {
  if (payloadOrLetterId && typeof payloadOrLetterId === 'object') {
    const payload = payloadOrLetterId as Record<string, any>;
    // debug: log token and payload
    try {
      // eslint-disable-next-line no-console
      console.debug('[createTribute] tokenPresent=', Boolean(tokenStore.getAccess()), 'payload=', payload);
    } catch (e) {}
    const { data } = await api.post('/tributes', payload);
    return data;
  }

  const letterId = payloadOrLetterId as string | number;
  // send only messageKey in the body for letter-specific endpoint, per Swagger
  const payload = { messageKey };
  try {
    // eslint-disable-next-line no-console
    console.debug('[createTribute] tokenPresent=', Boolean(tokenStore.getAccess()), 'payload=', payload);
  } catch (e) {}
  const { data } = await api.post(`/letters/${letterId}/tributes`, payload);
  return data;
};

export const deleteTributeById = async (tributeId: string | number) => {
  const { data } = await api.delete(`/tributes/${tributeId}`);
  return data;
};

// 편지의 일부 필드(예: tributeCount)만 업데이트하는 PATCH 유틸
export const patchLetter = async (letterId: number | string, payload: Partial<{ tributeCount: number }>) => {
  const { data } = await api.patch(`/letters/${letterId}`, payload);
  return data;
};
