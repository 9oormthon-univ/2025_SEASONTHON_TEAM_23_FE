import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { api } from '@/services/axiosInstance';
import { showStarBatchNotification } from '@/provider/NotifeeClient';
import { loadNotifyItems, saveNotifyItems, type StoredStarItem } from '@/store/notifyStorage';
import { useAuth } from '@/provider/AuthProvider';

const parseRecentArray = (resp: any): StoredStarItem[] => {
  const serverIso = (() => {
    const h = resp?.headers?.date;
    return h ? new Date(h).toISOString() : new Date().toISOString();
  })();

  const data = resp?.data ?? resp;

  if (Array.isArray(data)) {
    return data
      .map((it: any) => ({
        id: `${serverIso}-${it.letterId ?? 'none'}-${Number(it.unreadTributeCount ?? 0)}`,
        count: Number(it.unreadTributeCount ?? 0),
        receivedAtIso: serverIso,
        letterId: typeof it.letterId === 'number' ? it.letterId : null,
        preview: it.content ?? null,
        photoUrl: it.photoUrl ?? null,
      }))
      .filter((x) => x.count > 0);
  }

  if (typeof data?.unreadTributeCount === 'number') {
    const count = Number(data.unreadTributeCount);
    if (count <= 0) return [];
    return [
      {
        id: `${serverIso}-none-${count}`,
        count,
        receivedAtIso: serverIso,
        letterId: null,
        preview: null,
        photoUrl: null,
      },
    ];
  }

  return [];
};

type Ctx = {
  items: StoredStarItem[];
  refetchNow: () => Promise<void>;
};

const NotifyContext = createContext<Ctx | null>(null);

type Props = {
  children: React.ReactNode;
  intervalMs?: number;
  maxItems?: number;
};

export const NotifyProvider: React.FC<Props> = ({
  children,
  intervalMs = 15000,
  maxItems = 100,
}) => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.userId ?? (user as any)?.id ?? null;

  const [items, setItems] = useState<StoredStarItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inFlightRef = useRef(false);
  const appState = useRef(AppState.currentState);

  // user 확정 시 로드 (authLoading 끝났고 user가 있을 때만)
  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      // 로그인 안 되어 있으면 폴링/저장을 멈추고 메모리는 비워둔다(표시용)
      setItems([]);
      return;
    }
    (async () => {
      const saved = await loadNotifyItems(userId);
      setItems(saved);
    })();
  }, [authLoading, userId]);

  // user가 있을 때만 저장
  useEffect(() => {
    if (!userId) return;
    void saveNotifyItems(userId, items);
  }, [userId, items]);

  const tick = useCallback(async () => {
    if (inFlightRef.current) return;
    if (authLoading || !userId) return; // 유저 확정 전에는 동작 금지
    inFlightRef.current = true;
    try {
      const resp = await api.get('/tributes/notifications/recent', {
        headers: { 'Cache-Control': 'no-cache' },
      });

      const parsed = parseRecentArray(resp);
      if (parsed.length === 0) return;

      setItems((prev) => {
        const prevIds = new Set(prev.map((p) => p.id));
        const merged = [...parsed.filter((p) => !prevIds.has(p.id)), ...prev];
        return merged.slice(0, maxItems);
      });

      const top = parsed[0];
      await showStarBatchNotification({
        count: top.count,
        letterId: top.letterId ?? null,
        preview: top.preview ? String(top.preview).slice(0, 140) : null,
        photoUrl: top.photoUrl ?? null,
      });
    } finally {
      inFlightRef.current = false;
    }
  }, [authLoading, userId, maxItems]);

  const start = useCallback(() => {
    if (timerRef.current) return;
    // 유저 확정되었을 때만 시작
    if (!authLoading && userId) {
      void tick(); // 즉시 1회
      timerRef.current = setInterval(() => void tick(), intervalMs);
    }
  }, [authLoading, userId, tick, intervalMs]);

  const stop = useCallback(() => {
    if (!timerRef.current) return;
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  // 앱 상태에 따라 시작/중지
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      appState.current = next;
      if (next === 'active') start();
      else stop();
    });
    return () => sub.remove();
  }, [start, stop]);

  // 의존 값 변하면 재시작 (auth/user 바뀌거나 interval 변경 시)
  useEffect(() => {
    stop();
    start();
    return () => stop();
  }, [start, stop, authLoading, userId, intervalMs]);

  return (
    <NotifyContext.Provider value={{ items, refetchNow: tick }}>{children}</NotifyContext.Provider>
  );
};

export const useNotify = () => {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error('useNotify는 NotifyProvider 내부에서만 사용하세요.');
  return ctx;
};
