import './global.css';
import { StatusBar } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import AppProvider from '@/provider/AppProvider';
import RootNavigator from '@/navigation/RootNavigator';
import { useEffect, useRef } from 'react';
import type { NavigationContainerRef } from '@react-navigation/native';
import {
  consumePendingOpenNotificationFlag,
  registerForegroundNotificationHandler,
} from '@/provider/NotifeeClient';
import notifee from '@notifee/react-native';

const App = () => {
  const navRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    const unsub = registerForegroundNotificationHandler(() => {
      navRef.current?.navigate('NotificationList'); // 실제 스크린 이름으로 교체
    });
    return unsub;
  }, []);

  // 2) 앱이 알림 탭으로 열렸는지 확인하여 이동
  useEffect(() => {
    const checkInitial = async () => {
      const initial = await notifee.getInitialNotification();
      if (initial && initial.pressAction?.id === 'open_notification' && navRef.current) {
        navRef.current.navigate('NotificationList');
      }

      const pending = await consumePendingOpenNotificationFlag();
      if (pending) navRef.current?.navigate('NotificationList');
    };
    checkInitial();
  }, []);

  useEffect(() => {
    const init = async () => {};

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, []);

  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor="#121826" />
      <RootNavigator navigationRef={navRef} />
    </AppProvider>
  );
};

export default App;
