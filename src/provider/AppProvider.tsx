import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import * as Font from 'expo-font';
import { queryClient } from './queryClient';
import { AuthProvider } from './AuthProvider';
import { NotifyProvider } from './NotifyProvider';
import { TributeProvider } from './TributeProvider';
import Loader from '@common/Loader';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        // Variable 유지 (안드/웹 등 기본 폰트로 사용)
        Pretendard: require('@fonts/PretendardVariable.ttf'),
        // 굵기별 TTF (iOS에서 확실한 굵기 표현용)
        'Pretendard-Regular': require('@fonts/Pretendard-Regular.ttf'),
        'Pretendard-Medium': require('@fonts/Pretendard-Medium.ttf'),
        'Pretendard-SemiBold': require('@fonts/Pretendard-SemiBold.ttf'),
        'Pretendard-Bold': require('@fonts/Pretendard-Bold.ttf'),
      });
      setReady(true);
    })();
  }, []);

  if (!ready) return <Loader />;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotifyProvider>
            <TributeProvider>{children}</TributeProvider>
          </NotifyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default AppProvider;
