import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { AuthProvider } from './AuthProvider';
import { NotifyProvider } from './NotifyProvider';
import { TributeProvider } from './TributeProvider';
import { ToastProvider } from './ToastProvider';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotifyProvider>
            <TributeProvider>
              <ToastProvider>{children}</ToastProvider>
            </TributeProvider>
          </NotifyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default AppProvider;
