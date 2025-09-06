import { useNotificationCenter } from '@/provider/NotificationCenter';
import { Image, View, Text, FlatList } from 'react-native';
import { formatRelativeKo } from '@/utils/formatRelativeKo';
import { useLayoutEffect } from 'react';
import { setHeaderExtras } from '@/types/Header';
import { useNavigation } from '@react-navigation/native';

const NotificationListScreen = () => {
  const navigation = useNavigation();
  const { items } = useNotificationCenter();

  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      hasBack: true,
      hasButton: true,
      icon: 'IcNotification',
      iconSize: 28,
      iconColor: '#9D9D9D',
      disabled: true,
    });
  }, []);

  return (
    <View className="bg-bg px-7">
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between gap-3 rounded-[20px] bg-bg-light px-7 py-5">
            <View className="gap-1">
              <View className="gap-0.5">
                <Text className="body2 text-gray-300">{`위로의 별을 받았어요`}</Text>
              </View>
              <Text className="subHeading3 text-white">{`총 ${item.count}명의 사람들이 위로의 별을 보냈어요.`}</Text>
            </View>
            <Text className="captionSB text-gray-300">{formatRelativeKo(item.createdAt)}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <View className="items-center gap-3">
              <Text className="subHeading1B text-gray-500">{`아직 온 알림이 없어요.`}</Text>
              <Image source={require('@images/img-notification-bg.png')} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default NotificationListScreen;
