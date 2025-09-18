import { View, Text } from 'react-native';
import WriteButton from '@/components/common/WriteButton';
import LetterFeed from '@/components/letter/LetterFeed';
import type { LetterStackParamList, RootStackParamList } from '@/types/navigation';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { setHeaderExtras } from '@/types/Header';

const LetterScreen = () => {
  const navigation = useNavigation<StackNavigationProp<LetterStackParamList>>();
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      title: '기억의 별자리',
      hasBack: true,
      hasButton: true,
      icon: 'IcNotification',
      iconSize: 28,
      iconColor: 'white',
      onBack: () => {
        if (navigation.canGoBack()) navigation.goBack();
        navigation.getParent()?.navigate('Tabs', { screen: 'Home' });
      },
      onPress: () => rootNavigation.navigate('NotificationList'),
    });
  }, [navigation]);

  return (
    <View className="flex-1 gap-8 bg-bg px-7 pt-8">
      <View className="items-center gap-3">
        <Text className="subHeading3 text-center !leading-7 text-white">{`사랑하는 반려동물과의 소중한\n추억을 함께 나누세요.`}</Text>
        <WriteButton label="편지 쓰기" onPress={() => navigation.navigate('LetterWriteScreen')} />
      </View>
      <LetterFeed />
    </View>
  );
};

export default LetterScreen;
