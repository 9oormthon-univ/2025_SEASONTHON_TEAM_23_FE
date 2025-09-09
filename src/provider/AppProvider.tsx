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
        Pretendard: require('@fonts/PretendardVariable.ttf'),
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
