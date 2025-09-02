import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

interface TributeContextType {
  tributedIds: Set<string>;
  fetchTributes: (userId: string) => Promise<void>;
  toggleTribute: (letterId: string, userId: string, messageKey?: string) => Promise<void>;
}

const TributeContext = createContext<TributeContextType | undefined>(undefined);

export const TributeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tributedIds, setTributedIds] = useState<Set<string>>(new Set());

  const fetchTributes = useCallback(async (userId: string) => {
    try {
      const res = await axios.get('http://10.0.2.2:3001/letter_tributes');
      const myTributes = res.data.filter((t: any) => t.fromUserId === userId || t.from_user_id === userId);
      setTributedIds(new Set(myTributes.map((t: any) => String(t.letterId ?? t.letter_id))));
    } catch (e) {
      setTributedIds(new Set());
    }
  }, []);

  const toggleTribute = useCallback(async (letterId: string, userId: string, messageKey?: string) => {
    const has = tributedIds.has(letterId);
    try {
      if (has) {
        // find existing tribute record to delete
        const tributesRes = await axios.get('http://10.0.2.2:3001/letter_tributes', {
          params: { letterId: String(letterId), fromUserId: userId }
        });
        const targetTribute = tributesRes.data[0];
        if (targetTribute) {
          await axios.delete(`http://10.0.2.2:3001/letter_tributes/${targetTribute.id}`);
        }
      } else {
        // include messageKey when creating a tribute
        const payload: any = {
          letterId: String(letterId),
          fromUserId: userId,
          createdAt: new Date().toISOString()
        };
        if (messageKey) payload.messageKey = messageKey;
        await axios.post('http://10.0.2.2:3001/letter_tributes', payload);
      }

      // 현재 tribute_count를 가져와서 증감
  const letterRes = await axios.get(`http://10.0.2.2:3001/letters/${letterId}`);
  let currentCount = letterRes.data.tributeCount ?? letterRes.data.tribute_count ?? 0;
  // defensive: treat negative currentCount as 0
  if (currentCount < 0) currentCount = 0;
  const nextCount = currentCount + (has ? -1 : 1);
  const safeCount = Math.max(0, nextCount);
  await axios.patch(`http://10.0.2.2:3001/letters/${letterId}`, { tributeCount: safeCount });

      await fetchTributes(userId);
    } catch (e) {
      console.error('Error in toggleTribute:', e);
    }
  }, [tributedIds, fetchTributes]);

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
