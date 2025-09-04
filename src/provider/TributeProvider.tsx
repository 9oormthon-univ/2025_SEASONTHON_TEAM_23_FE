import React, { createContext, useContext, useState, useCallback } from 'react';
// axios 직접 사용 제거, services로 위임
import {
  fetchTributes as apiFetchTributes, // GET /letters/{letterId}/tributes — swagger
  createTribute,                    // POST /letters/{letterId}/tributes — swagger
  deleteTributeById,                // DELETE /tributes/{tributeId} — swagger
  fetchLetterById,                  // GET /letters/{letterId} — swagger
  fetchTributeMessages,             // GET /tributes/messages — swagger
} from '@/services/letters';

interface TributeContextType {
  tributedIds: Set<string>;
  fetchTributes: (userId: number) => Promise<void>;
  toggleTribute: (letterId: string, userId: number, messageKey?: string) => Promise<void>;
}

const TributeContext = createContext<TributeContextType | undefined>(undefined);

export const TributeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tributedIds, setTributedIds] = useState<Set<string>>(new Set());

  const fetchTributes = useCallback(async (userId: number) => {
    try {
      // Swagger에 전역 GET /tributes 는 없음. 사용자별로는 /tributes/messages 로 우회.
      const res = await fetchTributeMessages();
      const list = (res as any)?.data ?? res ?? [];
      const ids = new Set<string>();
      if (Array.isArray(list)) {
        for (const t of list) {
          // 서버가 message 항목에 letterId를 내려준다는 가정. 없으면 스킵.
          const lid = t?.letterId ?? t?.letter?.id;
          if (lid != null) ids.add(String(lid));
        }
      }
      setTributedIds(ids);
    } catch (e: any) {
      if (e?.response?.status === 403) {
        console.warn('[TributeProvider] fetchTributes 403 - authorization required or token expired');
      } else {
        console.error('[TributeProvider] fetchTributes error', e);
      }
      setTributedIds(new Set());
    }
  }, []);

  const toggleTribute = useCallback(
    async (letterId: string, userId: number, messageKey?: string) => {
      const has = tributedIds.has(letterId);
      try {
        if (has) {
          // 기존 헌화 레코드 조회 후 삭제 (swagger 경로: GET /letters/{letterId}/tributes)
          const list = await apiFetchTributes(String(letterId));
          const arr = (list as any)?.data ?? list ?? [];
          const mine = Array.isArray(arr)
            ? arr.find((t: any) => String(t?.fromUserId ?? t?.userId) === String(userId))
            : undefined;
          if (mine?.id != null) {
            await deleteTributeById(mine.id); // DELETE /tributes/{tributeId}
          }
        } else {
          // 헌화 생성 (messageKey 포함 가능)
          // call letter-specific endpoint to satisfy backend which expects POST /letters/:id/tributes
          // createTribute signature: (letterId, messageKey?) -> body should be { messageKey }
          const msgKey = messageKey ?? 'THANKS';
          await createTribute(String(letterId), msgKey);
        }

        // 단건 새로고침으로 화면 동기화, 그리고 내 헌화 목록도 갱신
        await fetchLetterById(letterId);
        await fetchTributes(userId);
      } catch (e: any) {
        // 403이면 토큰/권한 문제 가능성 -> 상태 초기화 및 로그
        if (e?.response?.status === 403) {
          console.warn('[TributeProvider] toggleTribute 403 - authorization required or token expired');
          // 권한 문제 시 로컬 상태 초기화(안전하게)
          setTributedIds(new Set());
          // 필요하다면 여기서 추가 동작(예: 토큰 갱신/로그아웃 유도)을 수행하세요.
          return;
        }
        console.error('Error in toggleTribute:', e);
      }
    },
    [tributedIds, fetchTributes]
  );

  return (
    <TributeContext.Provider value={{ tributedIds, fetchTributes, toggleTribute }}>
      {children}
    </TributeContext.Provider>
  );
};

export const useTribute = () => {
  const ctx = useContext(TributeContext);
  if (!ctx) throw new Error('useTribute must be used within a TributeProvider');
  return ctx;
};
