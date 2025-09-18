import { api } from './axiosInstance';

export type MyPageSummary = {
  dailyLogCount: number;
  letterCount: number;
  tributeCount: number;
};

export const fetchMyPageSummary = async (): Promise<MyPageSummary> => {
  const { data } = await api.get('/mypage/summary');
  return data;
};

/**
 * 닉네임 최초 생성(POST) 또는 이후 수정(PUT) - 백엔드 규칙:
 *  - 아직 닉네임이 없는 경우: POST /mypage/nickname
 *  - 이미 존재하는 경우: PUT  /mypage/nickname
 *  여기서는 먼저 POST 시도 후, 이미 존재한다면(409 등) PUT으로 폴백.
 */
export const upsertNickname = async (nickname: string): Promise<void> => {
  const body = { nickname };
  try {
    await api.post('/mypage/nickname', body);
  } catch (e: any) {
    const status = e?.response?.status;
    // 존재함/잘못된 메서드 등의 경우 PUT으로 재시도
    if ([400, 403, 404, 405, 409, 422].includes(status)) {
      await api.put('/mypage/nickname', body);
      return;
    }
    throw e;
  }
};

