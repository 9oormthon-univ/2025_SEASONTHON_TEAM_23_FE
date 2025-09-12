import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_OPEN_KEY = 'PENDING_OPEN_NOTIFICATION';
let channelId: string | null = null;

export const initNotifications = async () => {
  await notifee.requestPermission();

  // Android 채널(최초 1회)
  if (!channelId) {
    channelId = await notifee.createChannel({
      id: 'star',
      name: '위로의 별',
      importance: AndroidImportance.HIGH,
    });
  }
};

export const showStarBatchNotification = async (count: number) => {
  await initNotifications();

  await notifee.displayNotification({
    title: '위로의 별을 받았어요',
    body: `${count}명의 사람들이 위로의 별을 보냈어요.`,
    android: {
      channelId: channelId ?? 'star',
      smallIcon: 'ic_stat_star',
      pressAction: { id: 'open_notification' },
    },
  });
};

// 포그라운드 이벤트 (알림 탭 등)
export const registerForegroundNotificationHandler = (onOpenNotificationScreen: () => void) => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail.pressAction?.id === 'open_notification') {
      onOpenNotificationScreen();
    }
  });
};

// 백그라운드 탭 이벤트 (필수: index.* 상단에 등록)
export const registerBackgroundNotificationHandler = () => {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS && detail.pressAction?.id === 'open_notification') {
      // 앱이 열릴 때 확인할 수 있도록 플래그 세팅
      await AsyncStorage.setItem(PENDING_OPEN_KEY, '1');
    }
  });
};

// App 시작/복귀 시 호출해서 이동 여부 판단
export const consumePendingOpenNotificationFlag = async () => {
  const flag = await AsyncStorage.getItem(PENDING_OPEN_KEY);
  if (flag) {
    await AsyncStorage.removeItem(PENDING_OPEN_KEY);
    return true;
  }
  return false;
};

// 앱 상태에 따라 알림 표시 정책(선택)
export const shouldShowNotification = () => AppState.currentState !== 'active';
