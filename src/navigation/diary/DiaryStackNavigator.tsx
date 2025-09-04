import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DiaryStackParamList } from '@/types/navigation';
import DiaryMainScreen from '@/screens/diary/DiaryMainScreen';
import DiaryWriteScreen from '@/screens/diary/DiaryWriteScreen';
import DiaryByDateScreen from '@/screens/diary/DiaryByDateScreen';
import CustomHeader from '@navigation/CustomHeader';
import type { HeaderProps } from '@/types/Header';
import DiaryEditScreen from '@/screens/diary/DiaryEditScreen';

const Stack = createNativeStackNavigator<DiaryStackParamList>();

const DiaryStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="DiaryMain"
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
              onBack={() => navigation.goBack()}
              onPress={onPress}
            />
          );
        },
      }}
    >
      <Stack.Screen
        name="DiaryMain"
        component={DiaryMainScreen}
        options={{ title: '오늘의 일기' }}
      />
      <Stack.Screen
        name="DiaryWrite"
        component={DiaryWriteScreen}
        options={{ title: '오늘의 일기' }}
      />
      <Stack.Screen
        name="DiaryByDate"
        component={DiaryByDateScreen}
        options={{ title: '오늘의 일기' }}
      />
      <Stack.Screen
        name="DiaryEdit"
        component={DiaryEditScreen}
        options={{ title: '오늘의 일기' }}
      />
    </Stack.Navigator>
  );
};

export default DiaryStackNavigator;
