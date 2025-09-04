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
  fetchTributes: (currentUserId?: number) => Promise<void>;
  toggleTribute: (letterId: string, userId: number, messageKey?: string) => Promise<void>;
}

const TributeContext = createContext<TributeContextType | undefined>(undefined);

export const TributeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tributedIds, setTributedIds] = useState<Set<string>>(new Set());

    const fetchTributes = useCallback(async (currentUserId?: number) => {
    try {
      // Swagger에 전역 GET /tributes 는 없음. 사용자별로는 /tributes/messages 로 우회.
        const res = await fetchTributeMessages();
      console.debug('[TributeProvider] fetchTributeMessages response:', res);
      const list = (res as any)?.data ?? res ?? [];
      console.debug('[TributeProvider] parsed list:', list);
      const ids = new Set<string>();
      if (Array.isArray(list) && currentUserId) {
        for (const t of list) {
          // 서버 응답 구조: { id, letterId, fromUserId, messageKey, createdAt }
          const lid = t?.letterId;
          const fromUserId = t?.fromUserId;
          console.debug('[TributeProvider] processing tribute:', t, 'letterId:', lid, 'fromUserId:', fromUserId, 'currentUserId:', currentUserId);
          
          // 현재 사용자가 헌화한 편지만 tributedIds에 추가
          if (lid != null && fromUserId != null && Number(fromUserId) === Number(currentUserId)) {
            ids.add(String(lid));
            console.debug('[TributeProvider] added letterId to tributedIds:', lid);
          }
        }
      }
      setTributedIds(ids);
      console.debug('[TributeProvider] fetchTributes success, tributedIds=', Array.from(ids));
    } catch (e: any) {
      if (e?.response?.status === 403) {
        console.warn('[TributeProvider] fetchTributes 403 - authorization required or token expired, keeping existing state');
        // Don't clear tributedIds on 403 - keep existing state
      } else {
        console.error('[TributeProvider] fetchTributes error', e);
        setTributedIds(new Set());
        console.debug('[TributeProvider] fetchTributes failed, tributedIds cleared');
      }
    }
  }, []);

  const toggleTribute = useCallback(
    async (letterId: string, userId: number, messageKey?: string) => {
      try {
        // Query server for existing tributes on this letter
        const list = await apiFetchTributes(String(letterId));
        const arr = (list as any)?.data ?? list ?? [];
        const mine = Array.isArray(arr)
          ? arr.find((t: any) => String(t?.fromUserId ?? t?.userId) === String(userId))
          : undefined;

        if (mine?.id != null) {
          // If server already has my tribute, delete it
          await deleteTributeById(mine.id);
        } else {
          // Otherwise create tribute
          const msgKey = messageKey ?? 'THANKS';
          await createTribute(String(letterId), msgKey);
        }

        // Refresh letter detail and my tribute list
        await fetchLetterById(letterId);
        try {
          await fetchTributes(userId);
        } catch (e: any) {
          // If fetchTributes fails, don't update local state - keep existing state
          console.warn('[TributeProvider] fetchTributes failed after operation, keeping existing state:', e?.response?.status);
        }
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
