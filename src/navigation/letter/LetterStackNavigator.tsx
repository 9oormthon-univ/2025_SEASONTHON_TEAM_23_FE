import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { LetterStackParamList } from '@/types/navigation';
import CustomHeader from '@navigation/CustomHeader';
import type { HeaderProps } from '@/types/Header';
import LetterScreen from '@/screens/letter/LetterScreen';
import LetterWriteScreen from '@/screens/letter/LetterWriteScreen';
import LetterDetailScreen from '@/screens/letter/LetterDetailScreen';

const Stack = createNativeStackNavigator<LetterStackParamList>();

const LetterStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LetterScreen"
      screenOptions={{
        header: (props) => {
          const { navigation, options, back } = props;
          const { hasBack, hasLogo, hasButton, icon, iconSize, iconColor, title, onPress } =
            options as unknown as HeaderProps;
          return (
            <CustomHeader
              hasBack={hasBack ?? !!back}
              hasLogo={!!hasLogo}
              hasButton={!!hasButton}
              icon={icon}
              iconSize={iconSize}
              iconColor={iconColor}
              title={title}
              onBack={() => {
                if (navigation.canGoBack()) navigation.goBack();
                navigation.getParent()?.navigate('Tabs', { screen: 'Home' });
              }}
              onPress={onPress}
            />
          );
        },
      }}
    >
      <Stack.Screen
        name="LetterScreen"
        component={LetterScreen}
        options={{ title: '기억의 별자리' }}
      />
      <Stack.Screen
        name="LetterWriteScreen"
        component={LetterWriteScreen}
        options={{ title: '기억의 별자리' }}
      />
      <Stack.Screen
        name="LetterDetail"
        component={LetterDetailScreen}
        options={{ title: '기억의 별자리' }}
      />
    </Stack.Navigator>
  );
};

export default LetterStackNavigator;
