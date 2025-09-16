import { Image, View, Text, FlatList, Platform, Pressable } from 'react-native';
import { useLayoutEffect } from 'react';
import { setHeaderExtras } from '@/types/Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { formatRelativeKo } from '@/utils/formatDate';
import Icon from '@common/Icon';
import { useNotify } from '@/provider/NotifyProvider';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { keepAllKorean } from '@/utils/keepAll';

const NotificationListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
          <Pressable
            onPress={() => {
              if (item.letterId != null) {
                navigation.navigate('Tabs', {
                  screen: 'Letter',
                  params: { screen: 'LetterDetail', params: { id: String(item.letterId) } },
                });
              }
            }}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            className="gap-1 rounded-[20px] bg-bg-light px-7 py-5"
          >
            <View className="flex-row items-center justify-between">
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
                <Text className="body2 text-gray-300">{`${item.count}명의 사람들이 위로의 별을 보냈어요.`}</Text>
              </View>
              <Text className="captionSB text-gray-300">
                {formatRelativeKo(item.receivedAtIso)}
              </Text>
            </View>
            <Text className="subHeading3 text-white">
              {item.preview ? (
                <Text className="body2 text-gray-300" numberOfLines={2}>
                  {keepAllKorean(item.preview)}
                </Text>
              ) : null}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center">
            <View className="items-center gap-12">
              <Text className="subHeading1B text-gray-500">{`아직 온 알림이 없어요.`}</Text>
              <Image source={require('@images/img-notification-dog.png')} />
            </View>
          </View>
        )}
        className={`${items.length > 0 ? 'py-[26px]' : 'pb-[25px]'}`}
        contentContainerStyle={{ flexGrow: 1 }}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
};

export default NotificationListScreen;
