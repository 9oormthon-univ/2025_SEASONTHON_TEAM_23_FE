import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_OPEN_KEY = 'PENDING_OPEN_NOTIFICATION';
const PENDING_LETTER_ID_KEY = 'PENDING_OPEN_LETTER_ID';
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

export const showStarBatchNotification = async (params: {
  count: number;
  letterId?: number | null;
  preview?: string | null;
  photoUrl?: string | null;
}) => {
  const { count, letterId, preview, photoUrl } = params;
  await initNotifications();

  const title = `${count}명의 사람들이 위로의 별을 보냈어요.`;
  const body = preview ? preview : '알림을 눌러 자세히 보기';

  await notifee.displayNotification({
    title,
    body,
    data: {
      letterId: letterId != null ? String(letterId) : '',
    },
    android: {
      channelId: channelId ?? 'star',
      smallIcon: 'ic_stat_star',
      pressAction: { id: 'open_notification' },
      // 본문이 길면 펼쳐보이도록 BIGTEXT
      style: photoUrl
        ? ({ type: AndroidStyle.BIGPICTURE, picture: photoUrl } as const)
        : preview
          ? ({ type: AndroidStyle.BIGTEXT, text: body } as const)
          : undefined,
    },
  });
};

// 포그라운드 이벤트 (알림 탭 등)
export const registerForegroundNotificationHandler = (
  onOpen: (params: { letterId?: number | null }) => void
) => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail.pressAction?.id === 'open_notification') {
      const raw = detail.notification?.data?.letterId as string | undefined;
      onOpen({ letterId: raw != null && raw !== '' ? Number(raw) : null });
    }
  });
};

// 백그라운드 탭 이벤트 (필수: index.* 상단에 등록)
export const registerBackgroundNotificationHandler = () => {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS && detail.pressAction?.id === 'open_notification') {
      const raw = detail.notification?.data?.letterId as string | undefined;
      await AsyncStorage.setItem(PENDING_OPEN_KEY, '1');
      if (raw) await AsyncStorage.setItem(PENDING_LETTER_ID_KEY, raw);
    }
  });
};

// App 시작/복귀 시 호출해서 이동 여부 판단
export const consumePendingOpenNotification = async (): Promise<{
  shouldOpen: boolean;
  letterId?: number | null;
}> => {
  const flag = await AsyncStorage.getItem(PENDING_OPEN_KEY);
  if (!flag) return { shouldOpen: false };
  await AsyncStorage.removeItem(PENDING_OPEN_KEY);
  const raw = await AsyncStorage.getItem(PENDING_LETTER_ID_KEY);
  if (raw) await AsyncStorage.removeItem(PENDING_LETTER_ID_KEY);
  return { shouldOpen: true, letterId: raw ? Number(raw) : null };
};

// 앱 상태에 따라 알림 표시 정책(선택)
export const shouldShowNotification = () => AppState.currentState !== 'active';
