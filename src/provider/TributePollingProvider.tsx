import React, { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useNotificationCenter } from '@/provider/NotificationCenter';
import { fetchNoreadTributeCount } from '@/services/notifications';
import { useAuth } from '@/provider/AuthProvider'; // userId를 여기서 가져온다고 가정

type Props = { children: React.ReactNode };
const ACTIVE_MS = 5000;
const INACTIVE_MS = 15000;

export const TributePollingProvider: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.userId ?? (user as any)?.id ?? null;

  const { add: pushNoti } = useNotificationCenter();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inFlight = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const schedule = useCallback(
    (state: AppStateStatus) => {
      clearTimer();
      const delay = state === 'active' ? ACTIVE_MS : INACTIVE_MS;
      timerRef.current = setInterval(async () => {
        if (!userId || inFlight.current) return;
        inFlight.current = true;
        try {
          const n = await fetchNoreadTributeCount(userId);
          if (n > 0) pushNoti(n);
        } catch {
          // 에러 무시
        } finally {
          inFlight.current = false;
        }
      }, delay);
    },
    [userId, pushNoti]
  );

  // 앱 상태 변화 감지
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      appState.current = next;
      schedule(next);
    });
    schedule(appState.current);
    return () => {
      sub.remove();
      clearTimer();
    };
  }, [schedule]);

  // userId가 바뀐 경우 재스케줄
  useEffect(() => {
    schedule(appState.current);
    return () => clearTimer();
  }, [userId, schedule]);

  return <>{children}</>;
};
