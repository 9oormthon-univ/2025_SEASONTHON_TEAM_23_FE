import './global.css';
import BootSplash from 'react-native-bootsplash';
import AppProvider from '@/provider/AppProvider';
import RootNavigator from '@/navigation/RootNavigator';
import { useEffect, useRef } from 'react';
import type { NavigationContainerRef } from '@react-navigation/native';
import {
  consumePendingOpenNotification,
  registerForegroundNotificationHandler,
} from '@/provider/NotifeeClient';
import notifee from '@notifee/react-native';
import { StatusBar } from 'react-native';
import * as Font from 'expo-font';
import ToastContainer from '@/components/common/ToastContainer';

const App = () => {
  const navRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    const unsub = registerForegroundNotificationHandler(({ letterId }) => {
      if (letterId != null) {
        navRef.current?.navigate('Tabs', {
          screen: 'Letter',
          params: { screen: 'LetterDetail', params: { id: String(letterId) } },
        });
      } else {
        navRef.current?.navigate('NotificationList');
      }
    });
    return unsub;
  }, []);

  // 2) 앱이 알림 탭으로 열렸는지 확인하여 이동
  const checkInitialNotification = async () => {
    const initial = await notifee.getInitialNotification();
    const pressed = initial?.pressAction?.id === 'open_notification';
    const raw = initial?.notification?.data?.letterId as string | undefined;
    const fromInitial = raw ? Number(raw) : null;

    if (pressed && navRef.current) {
      if (fromInitial != null) {
        navRef.current.navigate('Tabs', {
          screen: 'Letter',
          params: { screen: 'LetterDetail', params: { id: String(fromInitial) } },
        });
      } else {
        navRef.current.navigate('NotificationList');
      }
      return;
    }

    const pending = await consumePendingOpenNotification();
    if (pending.shouldOpen && navRef.current) {
      if (pending.letterId != null) {
        navRef.current.navigate('Tabs', {
          screen: 'Letter',
          params: { screen: 'LetterDetail', params: { id: String(pending.letterId) } },
        });
      } else {
        navRef.current.navigate('NotificationList');
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await Font.loadAsync({
          Pretendard: require('@fonts/PretendardVariable.ttf'),
          'Pretendard-Regular': require('@fonts/Pretendard-Regular.ttf'),
          'Pretendard-Medium': require('@fonts/Pretendard-Medium.ttf'),
          'Pretendard-SemiBold': require('@fonts/Pretendard-SemiBold.ttf'),
          'Pretendard-Bold': require('@fonts/Pretendard-Bold.ttf'),
        });

        // 네비게이터 마운트를 잠깐 기다린 후 초기 알림 라우팅
        await new Promise((r) => setTimeout(r, 50));
        await checkInitialNotification();
      } finally {
        if (mounted) {
          // 폰트 준비 + 초기 라우팅 처리 후 스플래시 내려주기
          await BootSplash.hide({ fade: true });
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <RootNavigator navigationRef={navRef} />
      <ToastContainer position="bottom" />
    </AppProvider>
  );
};

export default App;
