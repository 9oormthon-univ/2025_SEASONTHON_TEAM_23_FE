import { Image, View, Text, FlatList, Platform } from 'react-native';
import { useLayoutEffect } from 'react';
import { setHeaderExtras } from '@/types/Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { formatRelativeKo } from '@/utils/formatRelativeKo';
import Icon from '@common/Icon';
import { useNotify } from '@/provider/NotifyProvider';

const NotificationListScreen = () => {
  const navigation = useNavigation();
  const { items, refetchNow } = useNotify();

  useFocusEffect(() => {
    void refetchNow();
  });

  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      hasBack: true,
      hasButton: true,
      title: '알림',
      icon: 'IcNotification',
      iconSize: 32,
      iconColor: '#9D9D9D',
      onBack: () => navigation.goBack(),
      disabled: true,
    });
  }, [navigation]);

  return (
    <View className="flex-1 bg-bg px-7">
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between gap-3 rounded-[20px] bg-bg-light px-7 py-5">
            <View className="gap-1">
              <View className="flex-row items-center gap-0.5">
                {Platform.OS === 'ios' ? (
                  <Image
                    source={require('@images/mini-star.png')}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                ) : (
                  <Icon name={'IcStar'} size={20} />
                )}
                <Text className="body2 text-gray-300">{`위로의 별을 받았어요`}</Text>
              </View>
              <Text className="subHeading3 text-white">{`${item.count}명의 사람들이 위로의 별을 보냈어요.`}</Text>
            </View>
            <Text className="captionSB text-gray-300">{formatRelativeKo(item.receivedAtIso)}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center">
            <View className="items-center gap-3">
              <Text className="subHeading1B text-gray-500">{`아직 온 알림이 없어요.`}</Text>
              <Image source={require('@images/img-notification-dog.png')} />
            </View>
          </View>
        )}
        className="py-[26px]"
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
};

export default NotificationListScreen;
