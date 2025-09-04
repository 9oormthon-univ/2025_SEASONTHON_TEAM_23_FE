import React, { createContext, useContext, useState, useCallback } from 'react';
// axios 직접 사용 제거, services로 위임
import {
  fetchTributes as apiFetchTributes,
  createTribute,
  deleteTributeById,
  fetchLetterById,
  patchLetter,
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
      const res = await apiFetchTributes({ fromUserId: userId });
      const list = (res as any)?.data ?? res ?? [];
      setTributedIds(new Set(list.map((t: any) => String(t.letterId))));
    } catch (e: any) {
      // 403이면 토큰/권한 문제 가능성 -> 로컬 상태 초기화, 로그 남김
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
          // 기존 헌화 레코드 조회 후 삭제
          const found = await apiFetchTributes({ letterId: String(letterId), fromUserId: userId });
          const target = (found as any)?.data ?? found;
          const targetRecord = Array.isArray(target) ? target[0] : target;
          if (targetRecord && targetRecord.id) {
            await deleteTributeById(targetRecord.id);
          }
        } else {
          // 헌화 생성 (messageKey 포함 가능)
          // call letter-specific endpoint to satisfy backend which expects POST /letters/:id/tributes
          // createTribute signature: (letterId, messageKey?) -> body should be { messageKey }
          await createTribute(String(letterId), messageKey);
        }

        // 현재 tribute_count를 가져와서 증감
        const letterRes = await fetchLetterById(letterId);
        const letterData = (letterRes as any)?.data ?? letterRes ?? {};
        let currentCount = Number(letterData.tributeCount ?? 0);
        // defensive: treat negative currentCount as 0
        if (currentCount < 0) currentCount = 0;
        const nextCount = currentCount + (has ? -1 : 1);
        const safeCount = Math.max(0, nextCount);
        await patchLetter(letterId, { tributeCount: safeCount });

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
