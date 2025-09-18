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
// POST /letters — now requires multipart/form-data with fields: content, isPublic, image (optional)
export const createLetter = async (params: {
  content: string;
  isPublic: boolean;
  image?: { uri: string; name?: string; type?: string } | null;
}) => {
  const form = new FormData();
  form.append('content', params.content);
  // boolean -> string 처리 (백엔드에서 문자열/불리언 모두 허용되더라도 안전하게 문자열화)
  form.append('isPublic', String(params.isPublic));

  if (params.image && params.image.uri) {
    const { uri, name, type } = params.image;
    // RN 환경에서는 FormData에 파일 객체를 as any로 캐스팅 필요
    form.append(
      'image',
      {
        uri,
        name: name ?? 'image.jpg',
        type: type ?? 'image/jpeg',
      } as any
    );
  }

  const { data } = await api.post('/letters', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// PUT /letters/{letterId} — swagger spec
export const updateLetter = async (
  letterId: number | string,
  params: Partial<{
    content: string;
    isPublic: boolean;
    image: { uri: string; name?: string; type?: string } | null;
    removeImage: boolean;
  }>
) => {
  const form = new FormData();

  if (params.content !== undefined) form.append('content', params.content);
  if (params.isPublic !== undefined) form.append('isPublic', String(params.isPublic));

  // 이미지 교체
  if (params.image && (params.image as any).uri) {
    const { uri, name, type } = params.image;
    form.append(
      'image',
      {
        uri,
        name: name ?? 'image.jpg',
        type: type ?? 'image/jpeg',
      } as any
    );
  }

  // 기존 이미지 제거 요청 (백엔드가 해당 필드를 인식한다고 가정)
  if (params.removeImage) {
    form.append('removeImage', 'true');
  }

  const { data } = await api.put(`/letters/${letterId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
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
