import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

interface TributeContextType {
  tributedIds: Set<string>;
  fetchTributes: (userId: string) => Promise<void>;
  toggleTribute: (letterId: string, userId: string) => Promise<void>;
}

const TributeContext = createContext<TributeContextType | undefined>(undefined);

export const TributeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tributedIds, setTributedIds] = useState<Set<string>>(new Set());

  const fetchTributes = useCallback(async (userId: string) => {
    try {
      const res = await axios.get('http://10.0.2.2:3001/letter_tributes');
      const myTributes = res.data.filter((t: any) => t.from_user_id === userId);
      setTributedIds(new Set(myTributes.map((t: any) => t.letter_id)));
    } catch (e) {
      setTributedIds(new Set());
    }
  }, []);

  const toggleTribute = useCallback(async (letterId: string, userId: string) => {
    console.log('TributeProvider toggleTribute called:', letterId, userId);
    const has = tributedIds.has(letterId);
    console.log('Has tribute:', has);
    try {
      if (has) {
        console.log('Deleting tribute');
        // 먼저 삭제할 tribute 레코드의 id를 찾기
        const tributesRes = await axios.get('http://10.0.2.2:3001/letter_tributes');
        const targetTribute = tributesRes.data.find((t: any) => 
          t.letter_id === letterId && t.from_user_id === userId
        );
        if (targetTribute) {
          await axios.delete(`http://10.0.2.2:3001/letter_tributes/${targetTribute.id}`);
        }
      } else {
        console.log('Adding tribute');
        await axios.post('http://10.0.2.2:3001/letter_tributes', {
          letter_id: letterId,
          from_user_id: userId,
          created_at: new Date().toISOString()
        });
      }
      // 현재 tribute_count를 가져와서 증감
      console.log('Getting current letter data');
      const letterRes = await axios.get(`http://10.0.2.2:3001/letters/${letterId}`);
      const currentCount = letterRes.data.tribute_count ?? 0;
      const nextCount = currentCount + (has ? -1 : 1);
      console.log('Current count:', currentCount, 'Next count:', nextCount);
      await axios.patch(`http://10.0.2.2:3001/letters/${letterId}`, { tribute_count: nextCount });
      console.log('Updated tribute count');
      await fetchTributes(userId);
      console.log('Fetched updated tributes');
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
