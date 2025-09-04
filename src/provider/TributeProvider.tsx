import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  fetchTributes as apiFetchTributes, // GET /letters/{letterId}/tributes — swagger
  createTribute,                    // POST /letters/{letterId}/tributes — swagger
  deleteTributeById,                // DELETE /tributes/{tributeId} — swagger
} from '@/services/letters';

interface TributeContextType {
  tributedIds: Set<string>;
  fetchTributes: (currentUserId?: number) => Promise<void>;
  toggleTribute: (letterId: string, userId: number, messageKey?: string) => Promise<void>;
}

const TributeContext = createContext<TributeContextType | undefined>(undefined);

export const TributeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tributedIds, setTributedIds] = useState<Set<string>>(new Set());

  const fetchTributes = useCallback(async (_currentUserId?: number) => {
    // Backend removed /tributes/messages; no server-side list available.
    // Keep existing state; components can update via toggleTribute after server success.
    return;
  }, []);

  const toggleTribute = useCallback(
    async (letterId: string, userId: number, _messageKey?: string) => {
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
          // Otherwise create tribute (no body)
          await createTribute(String(letterId));
        }

        // Update local state after confirmed server success
        setTributedIds((prev) => {
          const next = new Set(prev);
          if (mine?.id != null) {
            next.delete(String(letterId));
          } else {
            next.add(String(letterId));
          }
          return next;
        });
      } catch (e: any) {
    // On failure, keep existing state; surface errors upstream if needed
    return;
      }
    },
  []
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
