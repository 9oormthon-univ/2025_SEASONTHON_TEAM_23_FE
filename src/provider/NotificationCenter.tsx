import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

export type AppNoti = {
  id: string;
  count: number; // 이번 사이클 동안 새로 들어온 헌화 개수
  createdAt: number; // Date.now()
  read?: boolean;
};

type Ctx = {
  items: AppNoti[];
  add: (count: number) => void; // 새 알림 추가(+토스트)
  markAllRead: () => void;
  clearAll: () => void;
};

const C = createContext<Ctx | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<AppNoti[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = useCallback(
    (msg: string) => {
      setToastMsg(msg);
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(toastAnim, { toValue: 0, duration: 160, useNativeDriver: true }).start(
            () => setToastMsg(null)
          );
        }, 1600);
      });
    },
    [toastAnim]
  );

  const add = useCallback(
    (count: number) => {
      const item: AppNoti = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        count,
        createdAt: Date.now(),
        read: false,
      };
      setItems((prev) => [item, ...prev].slice(0, 200));
      showToast(`새 헌화 ${count}개 도착!`);
    },
    [showToast]
  );

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  }, []);
  const clearAll = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, add, markAllRead, clearAll }),
    [items, add, markAllRead, clearAll]
  );

  return (
    <C.Provider value={value}>
      {children}

      {/* 전역 토스트 */}
      {toastMsg ? (
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 80,
            alignItems: 'center',
            opacity: toastAnim,
            transform: [
              {
                translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }),
              },
            ],
          }}
        >
          <View
            style={{
              backgroundColor: '#121826',
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>{toastMsg}</Text>
          </View>
        </Animated.View>
      ) : null}
    </C.Provider>
  );
};

export const useNotificationCenter = () => {
  const ctx = useContext(C);
  if (!ctx) throw new Error('useNotificationCenter must be used within NotificationProvider');
  return ctx;
};
